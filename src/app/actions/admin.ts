'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  ADMIN_COOKIE_NAME, 
  DEFAULT_ADMIN_EMAIL, 
  DEFAULT_ADMIN_PASSWORD, 
  createSessionToken 
} from '../../lib/auth/adminAuth';
import { catalogRepository } from '../../lib/db/repository';
import { 
  ProductInput, 
  ProductInputSchema, 
  ProductStatus, 
  CategoryInput, 
  CategoryInputSchema,
  OwnProductInput, 
  OwnProductInputSchema 
} from '../../lib/db/schema';

// 1. Owner Login Action
export async function loginAdminAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const validEmail = DEFAULT_ADMIN_EMAIL.toLowerCase();

  if (cleanEmail !== validEmail || password !== DEFAULT_ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid owner credentials.' };
  }

  const token = createSessionToken(cleanEmail);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return { success: true };
}

// 2. Owner Logout Action
export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect('/admin/login');
}

// 3. Create Product Action
export async function createProductAction(input: ProductInput) {
  const parsed = ProductInputSchema.safeParse(input);
  if (!parsed.success) {
    return { 
      success: false, 
      error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') 
    };
  }

  const result = await catalogRepository.createProduct(parsed.data);
  if (result.success) {
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/admin/links');
    revalidatePath('/shop');
    revalidatePath('/');
    if (result.product?.slug) {
      const cleanSlug = result.product.slug.replace(/^\/+/, '');
      revalidatePath(`/product/${cleanSlug}`);
    }
  }
  return result;
}

// 4. Update Product Action
export async function updateProductAction(id: string, input: Partial<ProductInput>) {
  const result = await catalogRepository.updateProduct(id, input);
  if (result.success) {
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath('/shop');
    if (result.product?.slug) {
      revalidatePath(`/product/${result.product.slug}`);
    }
  }
  return result;
}

// 5. Delete Product Action
export async function deleteProductAction(id: string) {
  const success = await catalogRepository.deleteProduct(id);
  if (success) {
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/shop');
  }
  return { success };
}

// 6. Toggle Product Status (Draft/Active/Paused/Archived)
export async function toggleProductStatusAction(id: string, status: ProductStatus) {
  const updated = await catalogRepository.toggleProductStatus(id, status);
  if (updated) {
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true, product: updated };
  }
  return { success: false, error: 'Product not found' };
}

// 7. Mark Price as Checked
export async function markLinkCheckedAction(linkId: string) {
  const success = catalogRepository.markLinkChecked(linkId);
  if (success) {
    revalidatePath('/admin');
    revalidatePath('/admin/links');
    return { success: true };
  }
  return { success: false, error: 'Link not found' };
}

// 8. Create Category
export async function createCategoryAction(input: CategoryInput) {
  const parsed = CategoryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid category input' };
  }

  const cat = catalogRepository.createCategory(parsed.data);
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { success: true, category: cat };
}

// 9. Delete Category
export async function deleteCategoryAction(id: string) {
  const success = catalogRepository.deleteCategory(id);
  if (success) {
    revalidatePath('/admin/categories');
    revalidatePath('/shop');
    return { success: true };
  }
  return { success: false, error: 'Category not found' };
}

// 10. Update Own Product
export async function updateOwnProductAction(id: string, input: Partial<OwnProductInput>) {
  const parsed = OwnProductInputSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  const updated = catalogRepository.updateOwnProduct(id, parsed.data);
  if (updated) {
    revalidatePath('/admin/own-products');
    revalidatePath('/shop/own-products');
    return { success: true, product: updated };
  }
  return { success: false, error: 'Owned product not found' };
}
