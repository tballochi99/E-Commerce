<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/profile', name: 'get_user_profile', methods: ["GET"])]
    public function getProfile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'User not logged in'], 401);
        }

        $profileData = [
            'gender' => $user->getGender(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'email' => $user->getEmail(),
            'address' => $user->getAddress(),
            'zipcode' => $user->getZipcode(),
            'city' => $user->getCity(),
            'country' => $user->getCountry(),
        ];


        return $this->json($profileData);
    }

    #[Route('/address', name: 'get_user_address', methods: ["GET"])]
    public function getAddress(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'User not logged in'], 401);
        }
        $address = $user->getAddress();
        $zipcode = $user->getZipcode();
        $city = $user->getCity();
        $country = $user->getCountry();
        $savedAddress = $user->getSavedAddress();

        return $this->json([
            'address' => $address,
            'zipcode' => $zipcode,
            'city' => $city,
            'country' => $country,
            'savedAddress' => $savedAddress,
        ]);
    }

    #[Route('/user/', name: 'get_user_by_id', methods: ["GET"])]
    public function getUserById(EntityManagerInterface $em): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user) {
                return $this->json(['error' => 'User not found'], 404);
            }

            $userData = [
                'gender' => $user->getGender(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
                'address' => $user->getAddress(),
                'zipcode' => $user->getZipcode(),
                'city' => $user->getCity(),
                'country' => $user->getCountry(),
            ];

            return $this->json($userData);
        } catch (Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], 400);
        }
    }

    #[Route('/profile/update', name: 'update_user_profile', methods: ["PUT"])]
    public function updateProfile(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Erreur lors du décodage JSON");
            }

            $user = $this->getUser();

            if (!$user) {
                return $this->json(['error' => 'User not logged in'], 401);
            }

            if (isset($data['gender'])) $user->setGender($data['gender']);
            if (isset($data['firstname'])) $user->setFirstname($data['firstname']);
            if (isset($data['lastname'])) $user->setLastname($data['lastname']);
            if (isset($data['email'])) $user->setEmail($data['email']);
            if (isset($data['address'])) $user->setAddress($data['address']);
            if (isset($data['zipcode'])) $user->setZipcode($data['zipcode']);
            if (isset($data['city'])) $user->setCity($data['city']);
            if (isset($data['country'])) $user->setCountry($data['country']);

            $em->persist($user);
            $em->flush();

            return $this->json(['message' => 'Profile updated successfully']);
        } catch (Exception $e) {
            return $this->json(['error' => 'Une erreur est survenue lors de la mise à jour du profil: ' . $e->getMessage()], 400);
        }
    }

    #[Route('/address/save', name: 'save_user_address', methods: ["POST"])]
    public function saveAddress(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'User not logged in'], 401);
        }

        $user->setAddress($data['address']);
        $user->setCity($data['city']);
        $user->setZipcode($data['zipcode']);
        $user->setCountry($data['country']);
        $user->setSavedAddress($data['savedAddress']);

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Address saved successfully']);
    }


    #[Route('/address/delete', name: 'delete_user_address', methods: ['DELETE'])]
    public function deleteAddress(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'User not logged in'], Response::HTTP_UNAUTHORIZED);
        }

        $user->setAddress(null);
        $user->setCity(null);
        $user->setZipcode(null);
        $user->setCountry(null);

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Address deleted successfully']);
    }
}
