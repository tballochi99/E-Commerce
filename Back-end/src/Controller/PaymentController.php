<?php

namespace App\Controller;

use App\Service\StripeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    private $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * @Route("/payment", name="payment")
     */
    public function payment(Request $request)
    {
        // Récupérez les détails du paiement (par exemple, depuis un formulaire)
        $token = $request->get('stripeToken');
        $amount = $request->get('amount'); // en centimes

        try {
            // Création du paiement
            $charge = $this->stripeService->charge($amount, $token);

            // Gérez le succès (par exemple, stockez les informations dans la base de données, envoyez un e-mail, etc.)
            // ...

            return $this->redirectToRoute('success_route'); // Redirigez vers une route de succès

        } catch (\Exception $e) {
            // Gérez les erreurs (par exemple, affichez un message d'erreur à l'utilisateur)
            $this->addFlash('error', 'Une erreur est survenue lors du paiement : ' . $e->getMessage());
            return $this->redirectToRoute('failure_route'); // Redirigez vers une route d'échec
        }
    }
}