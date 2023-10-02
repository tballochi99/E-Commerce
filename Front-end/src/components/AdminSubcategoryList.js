import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Alert, Button, Card, Form, FormControl, Modal, Spinner} from 'react-bootstrap';

function AdminSubcategoryList() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
    const [editingSubcategoryName, setEditingSubcategoryName] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
    const token = localStorage.getItem('jwtToken');

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            setError('Erreur lors du chargement des catégories.');
            console.error(error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/subcategories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSubcategories(response.data);
        } catch (error) {
            setError('Erreur lors du chargement des sous-catégories.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory.id);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const category = categories.find(cat => cat.id.toString() === categoryId);
        setSelectedCategory(category);
    };

    const handleAddSubcategory = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/subcategory`, {
                name: newSubcategoryName,
                category_id: selectedCategory.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewSubcategoryName('');
            fetchSubCategories(selectedCategory.id);
        } catch (error) {
            setError('Erreur lors de l\'ajout de la sous-catégorie.');
            console.error(error);
        }
    };
    const openDeleteModal = (subcategory) => {
        setSubcategoryToDelete(subcategory);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setSubcategoryToDelete(null);
    };

    const confirmDeleteSubcategory = async () => {
        if (subcategoryToDelete) {
            await handleDeleteSubcategory(subcategoryToDelete);
        }
        closeDeleteModal();
    };
    const handleEditSubcategory = (subcategory) => {
        setEditingSubcategoryId(subcategory.id);
        setEditingSubcategoryName(subcategory.name);
    };

    const handleUpdateSubcategory = async (subcategory) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/admin/subcategory/${subcategory.id}`, {name: editingSubcategoryName}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchSubCategories(selectedCategory.id);
            setEditingSubcategoryId(null);
        } catch (error) {
            setError('Erreur lors de la mise à jour de la sous-catégorie.');
            console.error(error);
        }
    };

    const handleDeleteSubcategory = async (subcategory) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/admin/subcategory/${subcategory.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchSubCategories(selectedCategory.id);
        } catch (error) {
            setError('Erreur lors de la suppression de la sous-catégorie.');
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <Form.Group controlId="categorySelector" className="mb-4">
                <Form.Label>Sélectionnez une catégorie</Form.Label>
                <Form.Control as="select" onChange={handleCategoryChange}>
                    <option value="">-- Sélectionnez une catégorie --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {isLoading ? (
                <div className="full-page-spinner">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <Form.Group className="d-flex mb-4">
                        <FormControl
                            type="text"
                            placeholder="Nouvelle sous-catégorie"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            className="mr-2"
                        />
                        <Button onClick={handleAddSubcategory}>Ajouter</Button>
                    </Form.Group>
                    {subcategories.map((subcategory) => (
                        <Card key={subcategory.id} className="mb-2">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                {editingSubcategoryId === subcategory.id ? (
                                    <div className="d-flex">
                                        <FormControl
                                            type="text"
                                            value={editingSubcategoryName}
                                            onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                            className="mr-2"
                                        />
                                        <Button
                                            onClick={() => handleUpdateSubcategory(subcategory)}>Sauvegarder</Button>
                                        <Button variant="secondary"
                                                onClick={() => setEditingSubcategoryId(null)}>Annuler</Button>
                                    </div>
                                ) : (
                                    <>
                                        {subcategory.name}
                                        <div>
                                            <Button onClick={() => handleEditSubcategory(subcategory)} className="mr-2">Mettre
                                                à jour</Button>
                                            <Button variant="danger"
                                                    onClick={() => openDeleteModal(subcategory)}>Supprimer</Button>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </>
            )}
            <Modal show={showModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer cette sous-catégorie? Cela supprimera également tout
                    les articles liés.
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSubcategory}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default AdminSubcategoryList;
