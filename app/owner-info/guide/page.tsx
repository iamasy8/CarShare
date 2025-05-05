import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, AlertTriangle } from "lucide-react"

export default function OwnerGuide() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Guide du propriétaire</h1>
        <p className="text-lg text-gray-600 mb-12">
          Tout ce que vous devez savoir pour optimiser vos locations et maximiser vos revenus sur CarShare.
        </p>

        {/* Table of contents */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-semibold mb-4">Sommaire</h2>
          <ul className="space-y-2">
            <li>
              <a href="#prepare" className="text-red-600 hover:underline">Préparer votre véhicule</a>
            </li>
            <li>
              <a href="#photos" className="text-red-600 hover:underline">Prendre de bonnes photos</a>
            </li>
            <li>
              <a href="#description" className="text-red-600 hover:underline">Rédiger une description efficace</a>
            </li>
            <li>
              <a href="#price" className="text-red-600 hover:underline">Fixer le bon prix</a>
            </li>
            <li>
              <a href="#handover" className="text-red-600 hover:underline">La remise des clés</a>
            </li>
            <li>
              <a href="#problems" className="text-red-600 hover:underline">Gérer les problèmes</a>
            </li>
          </ul>
        </div>

        {/* Prepare vehicle section */}
        <div id="prepare" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Préparer votre véhicule</h2>
          <p className="mb-4">
            Une voiture bien entretenue et propre est essentielle pour obtenir de bonnes évaluations et attirer plus de locataires.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Effectuez un nettoyage complet de l'intérieur et de l'extérieur du véhicule</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Vérifiez les niveaux (huile, liquide de refroidissement, lave-glace)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Contrôlez la pression des pneus et leur usure</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Assurez-vous que tous les papiers du véhicule sont à jour et accessibles</span>
            </li>
          </ul>
        </div>

        {/* Photos section */}
        <div id="photos" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Prendre de bonnes photos</h2>
          <p className="mb-4">
            Les photos sont la première chose que les locataires potentiels regardent. Des photos de qualité augmentent considérablement vos chances de location.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Prenez des photos en plein jour avec une bonne luminosité</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Photographiez l'extérieur sous plusieurs angles (avant, arrière, côtés)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>N'oubliez pas l'intérieur : tableau de bord, sièges, coffre</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Mettez en valeur les équipements spécifiques (GPS, toit ouvrant, etc.)</span>
            </li>
          </ul>
        </div>

        {/* Description section */}
        <div id="description" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Rédiger une description efficace</h2>
          <p className="mb-4">
            Une description détaillée et honnête permet aux locataires de savoir exactement à quoi s'attendre.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Mentionnez les caractéristiques principales (marque, modèle, année, carburant)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Détaillez les équipements (climatisation, GPS, Bluetooth, etc.)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Précisez la consommation de carburant et la taille du coffre</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Soyez transparent sur les éventuelles limitations (kilométrage, zones géographiques)</span>
            </li>
          </ul>
        </div>

        {/* Price section */}
        <div id="price" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Fixer le bon prix</h2>
          <p className="mb-4">
            Un tarif compétitif est crucial pour attirer des locataires tout en assurant une rentabilité optimale.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Comparez avec des véhicules similaires dans votre région</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Ajustez selon la saison (été/hiver) et les périodes de forte demande</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Proposez des réductions pour les locations longue durée</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>N'oubliez pas de prendre en compte l'amortissement et l'entretien</span>
            </li>
          </ul>
        </div>

        {/* Handover section */}
        <div id="handover" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">La remise des clés</h2>
          <p className="mb-4">
            Une remise des clés bien organisée permet d'établir une relation de confiance et d'éviter les malentendus.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Prévoyez suffisamment de temps pour l'état des lieux</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Prenez des photos du véhicule avant et après la location</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Vérifiez ensemble le niveau de carburant et le kilométrage</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Expliquez les spécificités du véhicule (démarrage, ouverture du coffre, etc.)</span>
            </li>
          </ul>
        </div>

        {/* Problems section */}
        <div id="problems" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Gérer les problèmes</h2>
          <p className="mb-4">
            Même avec une préparation optimale, des problèmes peuvent survenir. Voici comment les gérer efficacement.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  En cas d'accident ou de problème grave, contactez immédiatement notre service d'assistance au 01 23 45 67 89.
                </p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Maintenez une communication claire et régulière avec le locataire</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>En cas de retard, essayez d'abord de contacter directement le locataire</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Pour les petits dommages, documentez-les avec des photos et discutez-en avec le locataire</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <span>Utilisez notre service de médiation en cas de désaccord persistant</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg mb-6">
            Vous avez d'autres questions sur la gestion de vos locations ?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/owner-info/faq">
                Consulter la FAQ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                Contacter le support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 