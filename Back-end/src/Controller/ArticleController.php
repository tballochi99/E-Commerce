<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\ArticleRepository;
use App\Repository\CategoryRepository;
use App\Repository\SubCategoryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{

    #[Route('/article', name: 'app_article', methods: ['GET'])]
    public function index(ArticleRepository $articleRepository, Request $request): Response
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 12);
        $query = $articleRepository->createQueryBuilder('a')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        $paginator = new Paginator($query);

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, iterator_to_array($paginator->getIterator()));

        $totalItems = count($paginator);
        $pagesCount = ceil($totalItems / $limit);

        return $this->json([
            'total_items' => $totalItems,
            'page' => $page,
            'pages_count' => $pagesCount,
            'items' => $articlesArray,
        ]);
    }


    #[Route('/article/popular', name: 'app_article_popular', methods: ['GET'])]
    public function popular(ArticleRepository $articleRepository): Response
    {
        $articles = $articleRepository->createQueryBuilder('a')
            ->orderBy('a.view_count', 'DESC')
            ->setMaxResults(4)
            ->getQuery()
            ->getResult();

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, $articles);

        return $this->json($articlesArray);
    }

    #[Route('/article/recommended', name: 'app_article_recommended', methods: ['GET'])]
    public function recommended(ArticleRepository $articleRepository): Response
    {
        $articles = $articleRepository->createQueryBuilder('a')
            ->where('a.isRecommended = :isRecommended')
            ->setParameter('isRecommended', true)
            ->setMaxResults(4)
            ->getQuery()
            ->getResult();

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, $articles);

        return $this->json($articlesArray);
    }


    #[Route('/article/search', name: 'app_article_search', methods: ['GET'])]
    public function search(Request $request, ArticleRepository $articleRepository): Response
    {
        $name = $request->query->get('name');
        $category = $request->query->get('category');

        $queryBuilder = $articleRepository->createQueryBuilder('a')
            ->setMaxResults(8);

        if ($name) {
            $queryBuilder->andWhere('a.title LIKE :name')
                ->setParameter('name', '%' . $name . '%');
        }

        if ($category) {
            $queryBuilder->andWhere('a.category_id = :category_id')
                ->setParameter('category_id', $category);
        }

        $articles = $queryBuilder->getQuery()->getResult();

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, $articles);

        return $this->json($articlesArray);
    }

    #[Route('/article/promotions', name: 'app_article_promotions', methods: ['GET'])]
    public function promotions(ArticleRepository $articleRepository): Response
    {
        $articles = $articleRepository->createQueryBuilder('a')
            ->where('a.discount > 0')
            ->setMaxResults(12)
            ->getQuery()
            ->getResult();

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, $articles);

        return $this->json($articlesArray);
    }

    #[Route('/article/latest', name: 'app_article_latest', methods: ['GET'])]
    public function latestArticles(ArticleRepository $articleRepository): Response
    {
        $articles = $articleRepository->createQueryBuilder('a')
            ->orderBy('a.id', 'DESC')
            ->setMaxResults(12)
            ->getQuery()
            ->getResult();

        $articlesArray = array_map(function ($article) {
            return $article->toArray();
        }, $articles);

        return $this->json($articlesArray);
    }


    #[Route('/admin/create_article', name: 'admin_create_article', methods: ['POST'])]
    public function createArticle(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository, CategoryRepository $categoryRepository, SubCategoryRepository $subCategoryRepository): Response
    {
        $parameters = json_decode($request->getContent(), true);

        $requiredKeys = ['title', 'content', 'price', 'category_id', 'features', 'stock', 'picture', 'subcategory_id', 'weight'];
        foreach ($requiredKeys as $key) {
            if (!array_key_exists($key, $parameters)) {
                return $this->json(['message' => "Le champ $key est requis."], 400);
            }
        }

        $subCategory = $subCategoryRepository->find($parameters['subcategory_id']);
        if (!$subCategory) {
            return $this->json(['message' => 'Sub Category not found'], 404);
        }

        $category = $categoryRepository->find($parameters['category_id']);
        if (!$category) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        $article = new Article();
        $article->setTitle($parameters['title']);
        $article->setContent($parameters['content']);
        $article->setPrice($parameters['price']);
        $article->setFeatures($parameters['features']);
        $article->setStock($parameters['stock']);
        $article->setPicture($parameters['picture']);
        $article->setViewCount(0);
        $article->setCategoryId($parameters['category_id']);
        $article->setSubCategory($subCategory);
        $article->setDiscount(0);
        $article->setWeight($parameters['weight']);

        try {
            $entityManager->persist($article);
            $entityManager->flush();
        } catch (Exception $e) {
            return $this->json(['message' => 'Une erreur s\'est produite lors de la création de l\'article.'], 500);
        }

        return $this->json([
            'message' => 'Article créé avec succès',
            'article' => $article->toArray()
        ]);
    }


    #[Route('/article/{id}', name: 'app_article_show', methods: ['GET'])]
    public function show(int $id, ArticleRepository $articleRepository, EntityManagerInterface $entityManager): Response
    {
        $article = $articleRepository->find($id);

        if (!$article) {
            throw $this->createNotFoundException(
                'No article found for id ' . $id
            );
        }

        $article->incrementViewCount();
        $entityManager->persist($article);
        $entityManager->flush();

        return $this->json($article->toArray());
    }


    #[Route('/article/{id}', name: 'app_article_update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $article = $entityManager->getRepository(Article::class)->find($id);

            if (!$article) {
                return $this->json(['message' => 'Article not found'], 404);
            }

            $data = json_decode($request->getContent(), true);

            if ($data['isRecommended'] === true) {
                $recommendedArticles = $entityManager->getRepository(Article::class)->findBy(['isRecommended' => true]);

            }

            if (isset($data['sub_category']) && isset($data['sub_category']['id'])) {
                $subCategory = $entityManager->getRepository(SubCategory::class)->find($data['sub_category']['id']);
                if ($subCategory) {
                    $article->setSubCategory($subCategory);
                } else {
                    return $this->json(['message' => 'Subcategory not found'], 400);
                }
            }

            if (isset($data['category']) && isset($data['category']['id'])) {
                $category = $entityManager->getRepository(Category::class)->find($data['category']['id']);
                if ($category) {
                    $article->setCategory($category);
                } else {
                    return $this->json(['message' => 'Category not found'], 400);
                }
            }

            if (empty($data['title']) || !is_string($data['title'])) {
                return $this->json(['message' => 'Invalid title provided'], 400);
            }
            $article->setTitle($data['title']);

            if (empty($data['content']) || !is_string($data['content'])) {
                return $this->json(['message' => 'Invalid content provided'], 400);
            }
            $article->setContent($data['content']);

            if (empty($data['features']) || !is_string($data['features'])) {
                return $this->json(['message' => 'Invalid features provided'], 400);
            }
            $article->SetFeatures($data['features']);

            if (empty($data['picture']) || !is_string($data['picture'])) {
                return $this->json(['message' => 'Invalid picture provided'], 400);
            }
            $article->setPicture($data['picture']);

            if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
                return $this->json(['message' => 'Invalid price provided'], 400);
            }
            $article->setPrice($data['price']);
            if (!isset($data['discount']) || !is_numeric($data['discount']) || $data['discount'] < 0 || $data['discount'] > 100) {
                return $this->json(['message' => 'Invalid discount provided'], 400);
            }
            $article->setDiscount($data['discount']);

            if (!isset($data['stock']) || !is_numeric($data['stock']) || $data['stock'] < 0) {
                return $this->json(['message' => 'Invalid stock provided'], 400);
            }
            $article->setStock($data['stock']);

            if (!isset($data['isRecommended']) || !is_bool($data['isRecommended'])) {
                return $this->json(['message' => 'Invalid isRecommended value provided'], 400);
            }
            $article->setIsRecommended($data['isRecommended']);
            if (!isset($data['weight']) || !is_numeric($data['weight']) || $data['weight'] <= 0) {
                return $this->json(['message' => 'Invalid weight provided'], 400);
            }
            $article->setWeight($data['weight']);
            $entityManager->flush();

            return $this->json(['message' => 'Article updated successfully'], 200);

        } catch (Exception $e) {
            return $this->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }


    #[Route('/article/{id}', name: 'app_article_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $article = $entityManager->getRepository(Article::class)->find($id);

        if (!$article) {
            return $this->json(['message' => 'Article not found'], 404);
        }

        $entityManager->remove($article);
        $entityManager->flush();

        return $this->json(['message' => 'Article deleted successfully'], 200);
    }
}
