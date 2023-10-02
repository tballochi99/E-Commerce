<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{

    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, LoggerInterface $logger, EntityManagerInterface $em, JWTTokenManagerInterface $jwtManager): Response
    {
        $parameters = json_decode($request->getContent(), true);
        $logger->info('Login method started');

        $email = $parameters['email'];
        $logger->info('Email: ', [$email]);

        $plainPassword = $parameters['password'];
        $logger->info('Password: ', [$plainPassword]);

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || !$passwordHasher->isPasswordValid($user, $plainPassword)) {
            $logger->info('Invalid email or password');
            return new Response('Email ou mot de passe invalide', Response::HTTP_BAD_REQUEST);
        }
        $logger->info('User fetched: ', [$user]);
        $logger->info('Request received: ', [$request->getContent()]);

        $token = $jwtManager->create($user);
        $logger->info('Token: ', [$token]);

        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());

        return $this->json([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'userId' => $user->getId(),
            'isAdmin' => $isAdmin,
            'token' => $token,
        ]);
    }


    #[Route('/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(Request $request, UserRepository $userRepository, LoggerInterface $logger, EntityManagerInterface $em): Response
    {
        $parameters = json_decode($request->getContent(), true);
        $logger->info('Logout method started');

        if (!isset($parameters['username'])) {
            $logger->error('Username not provided in request body');
            return new Response('Username non fourni', Response::HTTP_BAD_REQUEST);
        }

        $username = $parameters['username'];
        $logger->info('Username: ', [$username]);

        $user = $userRepository->findOneBy(['email' => $username]);

        if (!$user) {
            $logger->info('User not found');
            return new Response('Utilisateur non trouvé', Response::HTTP_BAD_REQUEST);
        }

        $em->flush();

        $logger->info('User logged out: ', [$user]);

        return $this->json(['message' => 'Déconnexion réussie']);
    }


}
