<?php
// src/Controller/LivraisonController.php

namespace App\Controller;

use App\Entity\Livraison;
use App\Repository\LivraisonRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class LivraisonController extends AbstractController
{
    #[Route('/livraison', name: 'livraison_index', methods: ['GET'])]
    public function index(LivraisonRepository $livraisonRepository): JsonResponse
    {
        $livraisons = $livraisonRepository->findAll();

        $data = array_map(function ($item) {
            return [
                'id' => $item->getId(),
                'pays' => $item->getPaysDeLivraison(),
                'mode' => $item->getModeDeLivraison(),
                'prix' => $item->getPrix(),
            ];
        }, $livraisons);

        return $this->json($data);
    }

    #[Route('/livraison/add', name: 'livraison_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['message' => 'Données invalides'], 400);
        }

        $livraison = new Livraison();
        $livraison->setPaysDeLivraison($data['pays']);
        $livraison->setModeDeLivraison($data['mode']);
        $livraison->setPrix($data['prix']);

        $entityManager->persist($livraison);
        $entityManager->flush();

        return $this->json(['message' => 'Livraison ajoutée']);
    }

    #[Route('/livraison/edit/{id}', name: 'livraison_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request, EntityManagerInterface $entityManager, LivraisonRepository $livraisonRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $livraison = $livraisonRepository->find($id);

        if (!$livraison) {
            return $this->json(['message' => 'Livraison non trouvée'], 404);
        }

        $livraison->setPaysDeLivraison($data['pays']);
        $livraison->setModeDeLivraison($data['mode']);
        $livraison->setPrix($data['prix']);

        $entityManager->flush();

        return $this->json(['message' => 'Livraison mise à jour']);
    }

    #[Route('/livraison/delete/{id}', name: 'livraison_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager, LivraisonRepository $livraisonRepository): JsonResponse
    {
        $livraison = $livraisonRepository->find($id);

        if (!$livraison) {
            return $this->json(['message' => 'Livraison non trouvée'], 404);
        }

        $entityManager->remove($livraison);
        $entityManager->flush();

        return $this->json(['message' => 'Livraison supprimée']);
    }
}
