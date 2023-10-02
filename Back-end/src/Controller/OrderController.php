<?php


namespace App\Controller;

use App\Entity\Article;
use App\Entity\Order;
use App\Repository\OrderRepository;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    #[Route('/order', name: 'app_order', methods: ['GET'])]
    public function index(OrderRepository $orderRepository, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $orders = $orderRepository->findBy(['user' => $user], ['orderDate' => 'DESC']);

        $data = array_map(function ($order) {
            $user = $order->getUser();
            $firstName = $user ? $user->getFirstName() : 'N/A';
            $lastName = $user ? $user->getLastName() : 'N/A';

            return [
                'id' => $order->getId(),
                'totalPrice' => $order->getTotalPrice(),
                'status' => $order->getStatus(),
                'orderDate' => $order->getOrderDate(),
                'shippingAddress' => $order->getShippingAddress(),
                'paymentMethod' => $order->getPaymentMethod(),
                'notes' => $order->getNotes(),
                'archived' => $order->getArchivedCartItems(),
                'userFirstName' => $firstName,
                'userLastName' => $lastName,
            ];
        }, $orders);

        return $this->json($data);
    }


    #[Route('/order/create', name: 'app_order_create', methods: ['POST'])]
    public function createOrder(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['message' => 'Une erreur est survenue'], 400);
        }

        $user = $this->getUser();

        $order = new Order();
        if ($user) {
            $order->setUser($user);
        }
        $order->setTotalPrice($data['totalPrice']);
        $order->setStatus($data['status']);
        $order->setOrderDate((new DateTime())->setTimezone(new DateTimeZone('Europe/Paris')));
        $order->setShippingAddress($data['shippingAddress']);
        $order->setPaymentMethod($data['paymentMethod']);
        $order->setNotes($data['notes'] ?? null);

        if ($user) {
            if (isset($data['cart'])) {
                $order->setArchivedCartItems(json_encode($data['cart']));
            }
        }

        $entityManager->persist($order);
        if ($user) {
            foreach ($data['cart'] as $cartItem) {
                $articleId = $cartItem['article']['id'];
                $quantityToReduce = $cartItem['quantity'];

                $article = $entityManager->getRepository(Article::class)->find($articleId);
                if ($article) {
                    if ($article->getStock() < $quantityToReduce) {
                        return $this->json(['message' => 'Article indisponible ou quantité insuffisante'], 400);
                    }

                    $newQuantity = $article->getStock() - $quantityToReduce;
                    $article->setStock($newQuantity);

                    $entityManager->persist($article);
                }
            }
        }

        $entityManager->flush();

        return $this->json(['message' => 'Commande créée avec succès']);
    }


    #[Route('/order/delete/{id}', name: 'app_order_delete', methods: ['DELETE'])]
    public function deleteOrder(int $id, EntityManagerInterface $entityManager, OrderRepository $orderRepository): JsonResponse
    {
        $order = $orderRepository->find($id);

        if (!$order) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        $entityManager->remove($order);
        $entityManager->flush();

        return $this->json(['message' => 'Commande supprimée avec succès']);
    }

}
