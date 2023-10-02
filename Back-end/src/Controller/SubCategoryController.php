<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\ArticleRepository;
use App\Repository\SubCategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SubCategoryController extends AbstractController
{
    #[Route('/subcategories', name: 'app_subcategories', methods: ['GET'])]
    public function index(SubCategoryRepository $subCategoryRepository): Response
    {
        $subCategories = $subCategoryRepository->findAll();
        $subCategoriesArray = array_map(function ($subCategory) {
            return [
                'id' => $subCategory->getId(),
                'name' => $subCategory->getName(),
            ];
        }, $subCategories);

        return $this->json($subCategoriesArray);
    }

    #[Route('/category/{categoryId}/subcategories', name: 'app_subcategories_by_category_oui', methods: ['GET'])]
    public function getSubcategoriesByCategory(SubCategoryRepository $subCategoryRepository, $categoryId): Response
    {
        $subCategories = $subCategoryRepository->findBy(['category' => $categoryId]);
        if (!$subCategories) {
            return $this->json(['message' => 'No subcategories found for this category'], 404);
        }
        $subCategoriesArray = array_map(function ($subCategory) {
            return $subCategory->toArray();
        }, $subCategories);

        return $this->json($subCategoriesArray);
    }


    #[Route('/subcategories/{categoryId}', name: 'app_subcategories_by_category', methods: ['GET'])]
    public function getByCategory(SubCategoryRepository $subCategoryRepository, $categoryId): Response
    {
        $subCategories = $subCategoryRepository->findBy(['category' => $categoryId]);
        $subCategoriesArray = array_map(function ($subCategory) {
            return [
                'id' => $subCategory->getId(),
                'name' => $subCategory->getName(),
            ];
        }, $subCategories);

        return $this->json($subCategoriesArray);
    }


    #[Route('/subcategories/{subCategoryId}/articles', name: 'articles_by_subcategory', methods: ['GET'])]
    public function getArticlesBySubCategory(ArticleRepository $articleRepository, $subCategoryId): Response
    {
        $articles = $articleRepository->findBy(['sub_category' => $subCategoryId]);

        return $this->json(array_map(fn($article) => $article->toArray(), $articles));
    }


    #[Route('/admin/subcategory', name: 'admin_create_subcategory', methods: ['POST'])]
    public function createSubCategory(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $parameters = json_decode($request->getContent(), true);

        $name = $parameters['name'];
        $categoryId = $parameters['category_id'];

        $category = $entityManager->getRepository(Category::class)->find($categoryId);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        $subCategory = new SubCategory();
        $subCategory->setName($name);
        $subCategory->setCategory($category);

        $entityManager->persist($subCategory);
        $entityManager->flush();

        return $this->json([
            'message' => 'SubCategory created successfully',
            'subcategory' => $subCategory->toArray()
        ]);
    }

    #[Route('/admin/subcategory/{id}', name: 'admin_update_subcategory', methods: ['PUT'])]
    public function updateSubCategory(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $subCategory = $entityManager->getRepository(SubCategory::class)->find($id);

        if (!$subCategory) {
            return $this->json(['message' => 'SubCategory not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $subCategory->setName($data['name']);

        $entityManager->flush();

        return $this->json(['message' => 'SubCategory updated successfully'], 200);
    }

    #[Route('/admin/subcategory/{id}', name: 'admin_delete_subcategory', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $subCategory = $entityManager->getRepository(SubCategory::class)->find($id);

        if (!$subCategory) {
            return $this->json(['message' => 'SubCategory not found'], 404);
        }

        $entityManager->remove($subCategory);
        $entityManager->flush();

        return $this->json(['message' => 'SubCategory deleted successfully'], 200);
    }
}