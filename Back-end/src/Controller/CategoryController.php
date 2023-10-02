<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CategoryController extends AbstractController
{
    #[Route('/categories', name: 'app_categories', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): Response
    {
        $categories = $categoryRepository->findAll();
        $categoriesArray = array_map(function ($category) {
            return [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'sub_categories' => array_map(function ($subCategory) {
                    return [
                        'id' => $subCategory->getId(),
                        'name' => $subCategory->getName(),
                    ];
                }, $category->getSubCategories()->toArray())
            ];
        }, $categories);

        return $this->json($categoriesArray);
    }


    #[Route('/admin/category', name: 'admin_create_category', methods: ['POST'])]
    public function createCategory(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $parameters = json_decode($request->getContent(), true);

        $name = $parameters['name'];

        $category = new Category();
        $category->setName($name);

        $entityManager->persist($category);
        $entityManager->flush();

        return $this->json([
            'message' => 'Category created successfully',
            'category' => $category->toArray()
        ]);
    }


    #[Route('/category/{id}', name: 'app_category_show_details', methods: ['GET'])]
    public function showCategory(int $id, CategoryRepository $categoryRepository): JsonResponse
    {
        $category = $categoryRepository->find($id);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ], 200);
    }

    #[Route('/category/{id}', name: 'app_category_update', methods: ['PUT'])]
    public function updateCategory(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $category = $entityManager->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $category->setName($data['name']);

        $entityManager->flush();

        return $this->json(['message' => 'Category updated successfully'], 200);
    }


    #[Route('/category/{id}', name: 'app_category_delete', methods: ['DELETE'])]
    public function deleteCategory(int $id, Request $request, Category $category, EntityManagerInterface $entityManager): Response
    {
        $category = $entityManager->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['message' => 'SubCategory not found'], 404);
        }

        $entityManager->remove($category);
        $entityManager->flush();

        return $this->json(['message' => 'SubCategory deleted successfully'], 200);
    }
}
