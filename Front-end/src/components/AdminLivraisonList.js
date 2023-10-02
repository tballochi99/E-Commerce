import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Card, Form, Modal, Spinner} from 'react-bootstrap';
import {AppContext} from "./AppContext";

function AdminLivraisonList() {
    const [livraisons, setLivraisons] = useState([]);
    const [newLivraison, setNewLivraison] = useState({pays: '', mode: '', prix: ''});
    const [editingLivraisonId, setEditingLivraisonId] = useState(null);
    const [editingLivraison, setEditingLivraison] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [livraisonToDelete, setLivraisonToDelete] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const [selectedLivraison, setSelectedLivraison] = useState(null);
    const {isAdmin} = useContext(AppContext);
    const [IsCharge, setIsCharge] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    const fetchLivraisons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/livraison`, {});
            setLivraisons(response.data);
        } catch (error) {
            setError('Erreur lors du chargement des livraisons.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLivraisons();
    }, []);

    const handleAddLivraison = async (e) => {
        e.preventDefault();
        setIsCharge(true);
        try {
            await axios.post('/livraison/add', newLivraison);
            setNewLivraison({pays: '', mode: '', prix: ''});
            fetchLivraisons();
            setFeedbackMessage('La livraison a été ajoutée avec succès.');
            setIsCharge(false);
        } catch (error) {
            setFeedbackMessage('Erreur lors de l\'ajout de la livraison.');
            console.error(error);
        }
    };

    const handleEditLivraison = (livraison) => {
        setEditingLivraisonId(livraison.id);
        setEditingLivraison(livraison);
    };

    const handleSelectLivraison = (e) => {
        const livraisonId = e.target.value;
        const selected = livraisons.find((liv) => liv.id === parseInt(livraisonId, 10));
        setSelectedLivraison(selected);
    };

    const handleDownload = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/export`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'rapport_admin.xlsx');
        link.click();
    };

    const handleUpdateLivraison = async (e) => {
        e.preventDefault();
        setIsCharge(true);
        try {

            const response = await axios.put(`/livraison/edit/${editingLivraisonId}`, editingLivraison, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setFeedbackMessage('La livraison a été mise à jour avec succès.');
                fetchLivraisons();
                setSelectedLivraison(editingLivraison);
                setEditingLivraisonId(null);
                setEditingLivraison({});
                setIsCharge(false);
            }
        } catch (error) {
            setError('Erreur lors de la mise à jour de la livraison.');
            setFeedbackMessage('Erreur lors de la mise à jour de la livraison.');
        }
    };


    function getModeDeLivraison(mode) {
        switch (mode) {
            case 1:
                return "Livraison Standard";
            case 2:
                return "Livraison Rapide";
            default:
                return "Inconnu";
        }
    }

    const handleDeleteLivraison = async () => {
        try {
            await axios.delete(`/livraison/delete/${livraisonToDelete.id}`);
            fetchLivraisons();
            setSelectedLivraison(null);
            setFeedbackMessage('La livraison a été supprimée avec succès.');
            closeDeleteModal();
        } catch (error) {
            setFeedbackMessage('Erreur lors de la suppression de la livraison.'); // Feedback pour l'erreur
            console.error(error);
        }
    };

    const openDeleteModal = (livraison) => {
        setLivraisonToDelete(livraison);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setLivraisonToDelete(null);
    };

    if (isLoading) {
        return (
            <div className="full-page-spinner">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!isAdmin) {
        return <div>Vous n'avez pas l'autorisation d'accéder à cette page.</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    {feedbackMessage &&
                        <div className="alert alert-info">{feedbackMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2 mb-4">
                    <h3>Ajouter une nouvelle livraison</h3>
                    <Form onSubmit={handleAddLivraison}>
                        <Form.Group controlId="newPays">
                            <Form.Label>Pays</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrer le pays"
                                value={newLivraison.pays}
                                onChange={(e) => setNewLivraison({
                                    ...newLivraison,
                                    pays: e.target.value
                                })}
                            />
                        </Form.Group>
                        <Form.Group controlId="newMode">
                            <Form.Label>Mode</Form.Label>
                            <Form.Control
                                as="select"
                                value={newLivraison.mode}
                                onChange={(e) => setNewLivraison({
                                    ...newLivraison,
                                    mode: parseInt(e.target.value, 10)
                                })}
                            >
                                <option value="" disabled>Sélectionner un mode</option>
                                <option value="1">Standard</option>
                                <option value="2">Rapide</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="newPrix">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Entrer le prix"
                                value={newLivraison.prix}
                                onChange={(e) => setNewLivraison({
                                    ...newLivraison,
                                    prix: parseFloat(e.target.value)
                                })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={IsCharge}>
                            {IsCharge ? 'Chargement...' : 'Ajouter'}
                        </Button>
                    </Form>
                    <Button className="mt-2" onClick={handleDownload}>Télécharger le rapport Excel</Button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2 mb-4">
                    <Form.Group controlId="selectLivraison">
                        <Form.Label>Choisir une livraison :</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedLivraison ? selectedLivraison.id : ''}
                            onChange={handleSelectLivraison}
                        >
                            <option value="" disabled>Sélectionner une option</option>
                            {livraisons.map((livraison) => (
                                <option key={livraison.id} value={livraison.id}>
                                    {livraison.pays} {livraison.mode === 1 ? " (Standard)" : " (Rapide)"}
                                </option>
                            ))}
                        </Form.Control>

                    </Form.Group>

                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2 mb-4">
                    {selectedLivraison && (
                        <Card>
                            <Card.Body>
                                <Card.Title>Détails de la livraison :</Card.Title>
                                <Card.Text>Pays de livraison : {selectedLivraison.pays}</Card.Text>
                                <Card.Text>Mode de livraison : {getModeDeLivraison(selectedLivraison.mode)}</Card.Text>
                                <Card.Text>Prix : {selectedLivraison.prix}</Card.Text>
                                <Button variant="primary" onClick={() => handleEditLivraison(selectedLivraison)}
                                        className="mr-2">
                                    Éditer
                                </Button>
                                <Button variant="danger" onClick={() => openDeleteModal(selectedLivraison)}>
                                    Supprimer
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2 mb-4">
                    {editingLivraisonId && (
                        <Form className="mb-4" onSubmit={handleUpdateLivraison}>
                            <Form.Group controlId="editPays">
                                <Form.Label>Pays de livraison</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingLivraison.pays}
                                    onChange={(e) => setEditingLivraison({
                                        ...editingLivraison,
                                        pays: e.target.value
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="editMode">
                                <Form.Label>Mode de livraison (1 = Standard || 2 = Rapide)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editingLivraison.mode}
                                    onChange={(e) => setEditingLivraison({
                                        ...editingLivraison,
                                        mode: parseInt(e.target.value, 10)
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="editPrix">
                                <Form.Label>Prix</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editingLivraison.prix}
                                    onChange={(e) => setEditingLivraison({
                                        ...editingLivraison,
                                        prix: parseFloat(e.target.value)
                                    })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={IsCharge}>
                                {IsCharge ? 'Chargement...' : 'Mettre à jour'}
                            </Button>
                        </Form>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer la livraison</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cette livraison ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDeleteLivraison}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default AdminLivraisonList;
