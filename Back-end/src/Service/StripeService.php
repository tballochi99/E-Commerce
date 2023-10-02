<?php

namespace App\Service;

use Stripe\Stripe;
use Stripe\Charge;

class StripeService
{
    private $secretKey;

    public function __construct(string $secretKey)
    {
        $this->secretKey = $secretKey;
        Stripe::setApiKey($this->secretKey);
    }

    public function charge(int $amount, string $token, string $description = 'Paiement', string $currency = 'eur')
    {
        return Charge::create([
            'amount' => $amount,
            'currency' => $currency,
            'description' => $description,
            'source' => $token,
        ]);
    }
}