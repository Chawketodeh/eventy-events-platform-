"use server";

import { connectToDatabase } from "@/lib/database";
import Category from "@/lib/database/models/category.model";

/* ===============================
   CREATE CATEGORY
================================ */
export async function createCategory(categoryData: { name: string }) {
  try {
    await connectToDatabase();

    const category = await Category.create(categoryData);
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Create category failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create category"
    );
  }
}

/* ===============================
   GET ALL CATEGORIES
================================ */
export async function getAllCategories() {
  try {
    await connectToDatabase();

    const categories = await Category.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Get all categories failed:", error);
    return [];
  }
}

/* ===============================
   GET CATEGORY BY ID
================================ */
export async function getCategoryById(categoryId: string) {
  try {
    await connectToDatabase();

    const category = await Category.findById(categoryId);
    if (!category) return null;

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Get category failed:", error);
    return null;
  }
}

/* ===============================
   UPDATE CATEGORY
================================ */
export async function updateCategory(
  categoryId: string,
  categoryData: { name: string }
) {
  try {
    await connectToDatabase();

    const category = await Category.findByIdAndUpdate(categoryId, categoryData, {
      new: true,
    });
    if (!category) throw new Error("Category not found");

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Update category failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update category"
    );
  }
}

/* ===============================
   DELETE CATEGORY
================================ */
export async function deleteCategory(categoryId: string) {
  try {
    await connectToDatabase();

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) throw new Error("Category not found");

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Delete category failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete category"
    );
  }
}
