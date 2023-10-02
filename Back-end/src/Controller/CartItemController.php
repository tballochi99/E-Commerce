<?php

namespace App\Controller;

use App\Entity\CartItem;
use App\Repository\ArticleRepository;
use App\Repository\CartItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CartItemController extends AbstractController
{
    #[Route('/cartitem', name: 'app_cartitem', methods: ['GET'])]
    public function index(CartItemRepository $cartItemRepository, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $cartItems = $cartItemRepository->findBy(['user' => $user]);

        $data = array_map(function ($item) {
            return $item->toArray();
        }, $cartItems);

        return $this->json($data);
    }

    #[Route('/cartitem/add', name: 'app_cartitem_add', methods: ['POST'])]
    public function addToCartItem(Request $request, EntityManagerInterface $entityManager, ArticleRepository $articleRepository, CartItemRepository $cartItemRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['message' => 'Une erreur est survenue'], 400);
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Utilisateur non authentifié'], 401);
        }
        $articleId = $data['id'];
        $quantity = $data['quantity'] ?? 1;

        if (!$articleId) {
            return $this->json(['message' => 'ID de l\'article manquant dans la requête'], 400);
        }

        $article = $articleRepository->find($articleId);
        if (!$article) {
            return $this->json(['message' => 'Article non trouvé'], 404);
        }

        $existingCartItem = $cartItemRepository->findOneBy(['user' => $user, 'article' => $article]);

        if ($existingCartItem) {
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + $quantity);
        } else {
            $cartItem = new CartItem();
            $cartItem->setUser($user);
            $cartItem->setArticle($article);
            $cartItem->setQuantity($quantity);
            $entityManager->persist($cartItem);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Article ajouté au panier']);
    }


    #[Route('/cartitem/remove/{id}', name: 'app_cartitem_remove', methods: ['DELETE'])]
    public function removeFromCartItem(int $id, Request $request, EntityManagerInterface $entityManager, CartItemRepository $cartItemRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $quantityToRemove = $data['quantity'] ?? 1;

        $cartItem = $cartItemRepository->find($id);

        if (!$cartItem) {
            return $this->json(['message' => 'Élément du panier non trouvé'], 404);
        }

        if ($quantityToRemove >= $cartItem->getQuantity()) {
            $entityManager->remove($cartItem);
        } else {
            $cartItem->setQuantity($cartItem->getQuantity() - $quantityToRemove);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Article mis à jour dans le panier']);
    }

    #[Route('/cartitem/removeAll/{id}', name: 'app_cartitemAll_remove', methods: ['DELETE'])]
    public function removeFromCartAllItem(int $id, Request $request, EntityManagerInterface $entityManager, CartItemRepository $cartItemRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $quantityToRemove = $data['quantity'] ?? 1;

        $cartItem = $cartItemRepository->find($id);

        if (!$cartItem) {
            return $this->json(['message' => 'Élément du panier non trouvé'], 404);
        }

        $entityManager->remove($cartItem);

        $entityManager->flush();

        return $this->json(['message' => 'Article mis à jour dans le panier']);
    }

    #[Route('/cart/validate', name: 'app_cart_validate', methods: ['POST'])]
    public function validateCart(Request $request, CartItemRepository $cartItemRepository, ArticleRepository $articleRepository): JsonResponse
    {
        $user = $this->getUser();
        $cartItems = $user ? $cartItemRepository->findBy(['user' => $user]) : json_decode($request->getContent(), true);

        foreach ($cartItems as $item) {
            $articleId = $user ? $item->getArticle()->getId() : $item['id'];
            $quantity = $user ? $item->getQuantity() : $item['quantity'];
            $article = $articleRepository->find($articleId);

            if (!$article) {
                return $this->json(['message' => "Article introuvable", 'status' => false], 200);
            }

            if ($quantity > $article->getStock()) {
                return $this->json(['message' => "Stock insuffisant pour l'article " . $article->getTitle(), 'status' => false], 200);
            }
        }

        return $this->json(['message' => "Stock suffisant pour tous les articles", 'status' => true], 200);
    }

    #[Route('/cartitem/update/{id}', name: 'app_cartitem_update', methods: ['PUT'])]
    public function updateCartItemQuantity(int $id, Request $request, EntityManagerInterface $entityManager, CartItemRepository $cartItemRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newQuantity = (int)($data['quantity'] ?? 1);

        $cartItem = $cartItemRepository->find($id);

        if (!$cartItem) {
            return $this->json(['message' => 'Élément du panier non trouvé'], 404);
        }

        $cartItem->setQuantity($newQuantity);

        $entityManager->flush();

        return $this->json(['message' => 'Quantité de l\'article mise à jour dans le panier']);
    }

    #[Route('/cart/clear', name: 'app_cart_clear', methods: ['POST'])]
    public function clearCart(Request $request, EntityManagerInterface $entityManager, CartItemRepository $cartItemRepository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $cartItems = $cartItemRepository->findBy(['user' => $user]);

        if (!$cartItems) {
            return $this->json(['message' => 'Panier non trouvé'], 404);
        }

        foreach ($cartItems as $item) {
            $entityManager->remove($item);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Panier vidé']);
    }
}
