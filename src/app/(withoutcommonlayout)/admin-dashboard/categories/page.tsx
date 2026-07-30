"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FolderPlus, Tag, SearchX, X, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
  getAllCategoriesAdminAction,
  createCategoryAdminAction,
  updateCategoryAdminAction,
  deleteCategoryAdminAction,
} from "../_actions/adminAction"

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: string
}

interface MetaData {
  page: number
  limit: number
  total: number
  totalPage: number
}

const CORAL = "#FF5A36"
const CORAL_DARK = "#C23B1F"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, total: 0, totalPage: 1 })
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [viewingCategory, setViewingCategory] = useState<CategoryItem | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCategories = async () => {
    setLoading(true)
    const response = await getAllCategoriesAdminAction({
      page,
      limit,
      search: debouncedSearch,
    })

    if (response && response.success) {
      setCategories(response.data || [])
      if (response.meta) {
        setMeta(response.meta)
      }
    } else {
      toast.error(response?.message || "Failed to load categories")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [page, limit, debouncedSearch])

  const handleOpenCreateModal = () => {
    setEditingCategory(null)
    setName("")
    setDescription("")
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (category: CategoryItem) => {
    setEditingCategory(category)
    setName(category.name)
    setDescription(category.description || "")
    setIsModalOpen(true)
  }

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsSubmitting(true)

    if (editingCategory) {
      // Update Category
      const result = await updateCategoryAdminAction(editingCategory.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      })

      if (result && result.success) {
        toast.success(result.message || "Category updated successfully!")
        setIsModalOpen(false)
        setEditingCategory(null)
        fetchCategories()
      } else {
        toast.error(result?.message || "Failed to update category")
      }
    } else {
      // Create Category
      const result = await createCategoryAdminAction({
        name: name.trim(),
        description: description.trim() || undefined,
      })

      if (result && result.success) {
        toast.success(result.message || "Category created successfully!")
        setName("")
        setDescription("")
        setIsModalOpen(false)
        fetchCategories()
      } else {
        toast.error(result?.message || "Failed to create category")
      }
    }

    setIsSubmitting(false)
  }

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return
    setIsDeleting(true)
    const result = await deleteCategoryAdminAction(deletingCategory.id)
    if (result && result.success) {
      toast.success(result.message || "Category deleted successfully!")
      setDeletingCategory(null)
      fetchCategories()
    } else {
      toast.error(result?.message || "Failed to delete category")
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
          >
            <FolderPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E2026]">Categories management</h1>
            <p className="text-xs text-[#6B707E]">
              Create, view, update, and manage service categories for technician bookings.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Add new category
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[#FF5A36] focus-within:ring-4 focus-within:ring-[#FF5A36]/10 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#9AA0AA] transition-colors group-focus-within:text-[#FF5A36]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-transparent text-xs font-medium text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F1EEE6] text-[#6B707E] transition-colors hover:bg-[#FF5A36] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-2 text-xs">
            <span className="text-[#6B707E]">Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              className="bg-transparent font-semibold text-[#1E2026] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#F1EEE6]" />
                        <div className="h-3.5 w-32 rounded bg-[#F1EEE6]" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-24 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-48 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-20 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-7 w-20 ml-auto rounded bg-[#F1EEE6]" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBF3] text-[#9AA0AA]">
                        <SearchX className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-medium text-[#1E2026]">No categories found</p>
                      <p className="text-xs text-[#6B707E]">Create a new category to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold"
                          style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
                        >
                          <Tag className="h-4 w-4" />
                        </span>
                        <p className="font-semibold text-[#1E2026]">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md border border-[#E7E2D8] bg-[#FFFBF3] px-2 py-0.5 font-mono text-[11px] font-medium text-[#6B707E]">
                        /{category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#4A4E58]">
                      {category.description || <span className="italic text-[#9AA0AA]">No description</span>}
                    </td>
                    <td suppressHydrationWarning className="px-6 py-4 text-[#6B707E]">
                      {new Date(category.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => setViewingCategory(category)}
                          title="View Details"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7E2D8] bg-white text-[#6B707E] transition-colors hover:border-[#0FA894] hover:bg-teal-50 hover:text-[#0FA894]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          title="Edit Category"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7E2D8] bg-white text-[#6B707E] transition-colors hover:border-[#FF5A36] hover:bg-orange-50 hover:text-[#FF5A36]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingCategory(category)}
                          title="Delete Category"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7E2D8] bg-white text-[#6B707E] transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E7E2D8] bg-[#FFFBF3] px-6 py-4 sm:flex-row">
          <p className="text-xs text-[#6B707E]">
            Showing{" "}
            <span className="font-semibold text-[#1E2026]">
              {meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#1E2026]">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-[#1E2026]">{meta.total}</span> categories
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="flex h-8 items-center justify-center gap-1 rounded-lg border border-[#E7E2D8] bg-white px-3 text-xs font-medium text-[#1E2026] transition-colors hover:border-[#FF5A36]/40 hover:bg-[#FFF6EA] disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-xs font-semibold text-[#1E2026]">
              Page {meta.page} of {meta.totalPage || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPage))}
              disabled={page >= meta.totalPage || loading}
              className="flex h-8 items-center justify-center gap-1 rounded-lg border border-[#E7E2D8] bg-[#FFFFFF] px-3 text-xs font-medium text-[#1E2026] transition-colors hover:border-[#FF5A36]/40 hover:bg-[#FFF6EA] disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Category Details Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
              <h2 className="text-lg font-extrabold text-[#1E2026]">Category Details</h2>
              <button
                onClick={() => setViewingCategory(null)}
                className="rounded-lg p-1 text-[#9AA0AA] transition-colors hover:bg-[#FFF6EA] hover:text-[#1E2026]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#6B707E] uppercase tracking-wider">Category Name</span>
                <p className="mt-1 text-base font-bold text-[#1E2026]">{viewingCategory.name}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#6B707E] uppercase tracking-wider">Slug</span>
                <p className="mt-1">
                  <span className="inline-flex rounded-md border border-[#E7E2D8] bg-[#FFFBF3] px-2 py-0.5 font-mono text-xs font-medium text-[#6B707E]">
                    /{viewingCategory.slug}
                  </span>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#6B707E] uppercase tracking-wider">Description</span>
                <p className="mt-1 rounded-xl bg-[#FFFBF3] p-3 leading-relaxed text-[#1E2026] border border-[#E7E2D8]">
                  {viewingCategory.description || "No description provided."}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#6B707E] uppercase tracking-wider">Created At</span>
                <p className="mt-1 font-medium text-[#4A4E58]">
                  {new Date(viewingCategory.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingCategory(null)}
                  className="rounded-xl bg-[#14171C] px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
              <h2 className="text-lg font-extrabold text-[#1E2026]">
                {editingCategory ? "Edit category" : "Add new category"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingCategory(null)
                }}
                className="rounded-lg p-1 text-[#9AA0AA] transition-colors hover:bg-[#FFF6EA] hover:text-[#1E2026]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-[#1E2026]">
                  Category name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electrical Services"
                  className="w-full rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3.5 py-2.5 text-xs text-[#1E2026] outline-none transition-colors focus:border-[#FF5A36] placeholder:text-[#9AA0AA]"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-[#1E2026]">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of repairs and services in this category..."
                  className="w-full rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3.5 py-2.5 text-xs text-[#1E2026] outline-none transition-colors focus:border-[#FF5A36] placeholder:text-[#9AA0AA]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingCategory(null)
                  }}
                  className="rounded-xl border border-[#E7E2D8] bg-white px-4 py-2.5 text-xs font-semibold text-[#6B707E] transition-colors hover:bg-[#FFF6EA] hover:text-[#1E2026]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:opacity-95 disabled:opacity-50"
                >
                  {isSubmitting ? (editingCategory ? "Saving..." : "Creating...") : (editingCategory ? "Save changes" : "Create category")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
                <AlertTriangle className="h-6 w-6" />
              </span>

              <h3 className="mt-4 text-base font-extrabold text-[#1E2026]">Delete category?</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B707E]">
                Are you sure you want to delete <span className="font-bold text-[#1E2026]">"{deletingCategory.name}"</span>? This action cannot be undone and may affect related services.
              </p>

              <div className="mt-6 flex w-full items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
                  disabled={isDeleting}
                  className="w-1/2 rounded-xl border border-[#E7E2D8] bg-white py-2.5 text-xs font-semibold text-[#6B707E] transition-colors hover:bg-[#FFF6EA] hover:text-[#1E2026] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-1/2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:opacity-95 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
