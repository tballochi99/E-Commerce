<?php


namespace App\Controller;

use App\Repository\ArticleRepository;
use App\Repository\OrderRepository;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class ExportController extends AbstractController
{
    #[Route('/export', name: 'export_data')]
    public function export(ArticleRepository $articleRepo, OrderRepository $orderRepo)
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->setActiveSheetIndex(0);
        $worksheet = $spreadsheet->getActiveSheet();

        $articles = $articleRepo->findAll();
        $worksheet->setCellValue('A1', 'ID');
        $worksheet->setCellValue('B1', 'Titles');
        $worksheet->setCellValue('C1', 'Prices');
        $worksheet->setCellValue('D1', 'Stocks');
        $worksheet->setCellValue('E1', 'Views');
        $worksheet->setCellValue('F1', 'Poids');
        $worksheet->setCellValue('G1', 'Promotions');


        $row = 2;
        foreach ($articles as $article) {
            $worksheet->setCellValue("A{$row}", $article->getId());
            $worksheet->setCellValue("B{$row}", $article->getTitle());
            $worksheet->setCellValue("C{$row}", $article->getPrice());
            $worksheet->setCellValue("D{$row}", $article->getStock());
            $worksheet->setCellValue("E{$row}", $article->getViewCount());
            $worksheet->setCellValue("F{$row}", $article->getWeight());
            $worksheet->setCellValue("G{$row}", $article->getDiscount());
            $row++;
        }

        $worksheet = $spreadsheet->createSheet();
        $worksheet->setTitle('Orders');

        $orders = $orderRepo->findAll();
        $worksheet->setCellValue('A1', 'Order ID');
        $worksheet->setCellValue('B1', 'User ID');
        $worksheet->setCellValue('C1', 'Total Price');
        $worksheet->setCellValue('D1', 'Articles');
        $worksheet->setCellValue('E1', 'Poid');
        $worksheet->setCellValue('F1', 'Adresse');
        $worksheet->setCellValue('G1', 'Prénom');
        $worksheet->setCellValue('H1', 'Nom');

        $row = 2;
        foreach ($orders as $order) {
            $worksheet->setCellValue("A{$row}", $order->getId());

            if ($order->getUser()) {
                $worksheet->setCellValue("B{$row}", $order->getUser()->getId());
                $worksheet->setCellValue("F{$row}", $order->getUser()->getAddress());  // Ajoutez l'adresse ici
                $worksheet->setCellValue("G{$row}", $order->getUser()->getFirstName());  // Ajoutez le prénom ici
                $worksheet->setCellValue("H{$row}", $order->getUser()->getLastName());  // Ajoutez le nom ici
            } else {
                $worksheet->setCellValue("B{$row}", 'N/A');
                $worksheet->setCellValue("F{$row}", 'N/A');
                $worksheet->setCellValue("G{$row}", 'N/A');
                $worksheet->setCellValue("H{$row}", 'N/A');
            }

            $worksheet->setCellValue("C{$row}", $order->getTotalPrice());

            $jsonData = $order->getArchivedCartItems();
            $archivedCartItems = json_decode($jsonData, true);

            if (is_array($archivedCartItems)) {
                $articleInfo = [];
                $totalWeight = 0;

                foreach ($archivedCartItems as $item) {
                    if (isset($item['article']['title'], $item['quantity'], $item['discount'])) {
                        $articleInfo[] = sprintf(
                            "%s (Quantité : %d, Réduction : %d%%)",
                            $item['article']['title'],
                            $item['quantity'],
                            $item['discount']
                        );

                        if (isset($item['article']['weight'])) {
                            $totalWeight += $item['article']['weight'] * $item['quantity'];
                        }
                    }
                }
                $worksheet->setCellValue("D{$row}", implode("; ", $articleInfo));
                $worksheet->setCellValue("E{$row}", $totalWeight);
            } else {
                $worksheet->setCellValue("D{$row}", 'Données non disponibles');
            }

            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'export.xlsx';

        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($temp_file);

        return $this->file($temp_file, $fileName, ResponseHeaderBag::DISPOSITION_INLINE);
    }

}
