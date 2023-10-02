<?php

namespace App\DataFixtures;

use App\Entity\Livraison;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class LivraisonFixture extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $paysListe = [
            'Afghanistan', 'Albanie', 'Algérie', 'Andorre', 'Angola', 'Antigua-et-Barbuda', 'Argentine', 'Arménie', 'Australie', 'Autriche',
            'Azerbaïdjan', 'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Biélorussie', 'Belgique', 'Belize', 'Bénin', 'Bhoutan', 'Bolivie',
            'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Cambodge', 'Cameroun', 'Canada',
            'Cap-Vert', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie', 'Comores', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Côte d\'Ivoire',
            'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Dominique', 'République Dominicaine', 'Équateur', 'Égypte', 'Salvador',
            'Émirats arabes unis', 'Érythrée', 'Estonie', 'Eswatini', 'Éthiopie', 'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie', 'Géorgie',
            'Allemagne', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana', 'Haïti', 'Honduras',
            'Hongrie', 'Islande', 'Inde', 'Indonésie', 'Iran', 'Irak', 'Irlande', 'Israël', 'Italie', 'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan',
            'Kenya', 'Kirghizistan', 'Kiribati', 'Koweït', 'Laos', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
            'Macédoine du Nord', 'Madagascar', 'Malawi', 'Malaisie', 'Maldives', 'Mali', 'Malte', 'Îles Marshall', 'Mauritanie', 'Maurice',
            'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Maroc', 'Mozambique', 'Myanmar (Birmanie)', 'Namibie',
            'Nauru', 'Népal', 'Pays-Bas', 'Nouvelle-Zélande', 'Nicaragua', 'Niger', 'Nigeria', 'Corée du Nord', 'Norvège', 'Oman', 'Pakistan',
            'Palaos', 'Palestine', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pérou', 'Philippines', 'Pologne', 'Portugal', 'Qatar',
            'Roumanie', 'Russie', 'Rwanda', 'Saint-Christophe-et-Niévès', 'Sainte-Lucie', 'Saint-Vincent-et-les-Grenadines', 'Samoa',
            'Saint-Marin', 'Sao Tomé-et-Principe', 'Arabie saoudite', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour',
            'Slovaquie', 'Slovénie', 'Îles Salomon', 'Somalie', 'Afrique du Sud', 'Corée du Sud', 'Soudan du Sud', 'Espagne', 'Sri Lanka',
            'Soudan', 'Suriname', 'Suède', 'Suisse', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Thaïlande', 'Timor-Leste', 'Togo', 'Tonga',
            'Trinité-et-Tobago', 'Tunisie', 'Turquie', 'Turkménistan', 'Tuvalu', 'Ouganda', 'Ukraine', 'Émirats arabes unis', 'Royaume-Uni',
            'États-Unis', 'Uruguay', 'Ouzbékistan', 'Vanuatu', 'Vatican', 'Venezuela', 'Viêt Nam', 'Yémen', 'Zambie', 'Zimbabwe'
        ];

        foreach ($paysListe as $pays) {
            $livraisonRapide = new Livraison();
            $livraisonRapide->setPaysDeLivraison($pays);
            $livraisonRapide->setModeDeLivraison(1);
            $livraisonRapide->setPrix(rand(20, 30));
            $manager->persist($livraisonRapide);

            $livraisonNormale = new Livraison();
            $livraisonNormale->setPaysDeLivraison($pays);
            $livraisonNormale->setModeDeLivraison(2);
            $livraisonNormale->setPrix(rand(10, 20));
            $manager->persist($livraisonNormale);
        }

        $manager->flush();
    }
}
