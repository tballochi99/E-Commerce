<?php

namespace App\Repository;

use App\Entity\DeliveryMode;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DeliveryMode>
 *
 * @method DeliveryMode|null find($id, $lockMode = null, $lockVersion = null)
 * @method DeliveryMode|null findOneBy(array $criteria, array $orderBy = null)
 * @method DeliveryMode[]    findAll()
 * @method DeliveryMode[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeliveryModeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DeliveryMode::class);
    }

//    /**
//     * @return DeliveryMode[] Returns an array of DeliveryMode objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('d.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?DeliveryMode
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
