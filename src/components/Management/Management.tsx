import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col, Navbar, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import dutyService from '../../services/dutyService';
import getListDutyResponse from '../../models/responses/duty/getListDutyResponse';
import AddDutyRequest from '../../models/requests/duty/addDutyRequest';
import UpdateDutyRequest from '../../models/requests/duty/updateDutyRequest';

interface Task {
    id: number;
    userId?: number;  // İsteğe bağlı hale getirildi
    title: string;
    description: string;
    createdDate: string;
    status: 'New' | 'InProgress' | 'Completed';
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Management: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'All' | 'New' | 'InProgress' | 'Completed'>('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const navigate = useNavigate();

    const fetchAllTasks = async () => {
        const user = authService.getUserInfo();

        if (!user || !user.id) {
            console.error('User ID is undefined or user information is missing:', user);
            return;
        }

        let allTasks: Task[] = [];
        let pageIndex = 0;
        let hasNext = true;

        try {
            while (hasNext) {
                const response = await dutyService.getTasksByUserId(user.id, 5, pageIndex);

                if (response.data && Array.isArray(response.data.items)) {
                    const tasks: Task[] = response.data.items.map((item: getListDutyResponse) => {
                        let status: 'New' | 'InProgress' | 'Completed' = 'New';
                        if (['New', 'InProgress', 'Completed'].includes(item.status)) {
                            status = item.status as 'New' | 'InProgress' | 'Completed';
                        }
                        return {
                            id: item.id,
                            userId: item.userId, // userId alanı ekleniyor
                            title: item.title,
                            description: item.description,
                            createdDate: item.createdDate || new Date().toISOString(),
                            status: status,
                        };
                    });
                    allTasks = [...allTasks, ...tasks];
                    hasNext = response.data.hasNext;
                    pageIndex += 1;
                } else {
                    console.error('Unexpected API response structure:', response.data);
                    hasNext = false;
                }
            }

            setTasks(allTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const handleDelete = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleAddTask = async () => {
        const user = authService.getUserInfo();

        if (!user || !user.id) {
            console.error('User ID is undefined or user information is missing:', user);
            return;
        }

        const newTaskRequest: AddDutyRequest = {
            userId: user.id,
            title: newTaskTitle,
            description: newTaskDescription,
            status: 1
        };

        try {
            const response = await dutyService.addTask(newTaskRequest);

            if (response.status === 201 || response.status === 200) {
                console.log('Task added successfully:', response.data);
                await fetchAllTasks();
                setNewTaskTitle('');
                setNewTaskDescription('');
            } else {
                console.error('Failed to add task:', response);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleSaveChanges = async () => {
        if (!editingTask) return;

        const user = authService.getUserInfo();

        if (!user || !user.id) {
            console.error('User ID is undefined or user information is missing:', user);
            return;
        }

        // Status değerini metinsel karşılıktan sayısal karşılığa dönüştürüyoruz
        const statusMapping: { [key in Task['status']]: number } = {
            New: 1,
            InProgress: 2,
            Completed: 3
        };

        const updatedTask: UpdateDutyRequest = {
            id: editingTask.id,
            title: editingTask.title,
            description: editingTask.description,
            status: statusMapping[editingTask.status],  // Burada dönüştürme yapıyoruz
        };

        try {
            const response = await dutyService.updateTask({ ...updatedTask, userId: user.id });
            await fetchAllTasks();
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };





    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const filteredTasks = tasks
        .filter(task => filter === 'All' || task.status === filter)
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
            } else {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            }
        });

    const renderEditModal = () => {
        if (!editingTask) return null;

        return (
            <Modal show={editingTask !== null} onHide={() => setEditingTask(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editTaskTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingTask.title}
                                onChange={(e) =>
                                    setEditingTask({ ...editingTask, title: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editTaskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingTask.description}
                                onChange={(e) =>
                                    setEditingTask({ ...editingTask, description: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editTaskStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={editingTask.status}
                                onChange={(e) =>
                                    setEditingTask({ ...editingTask, status: e.target.value as Task['status'] })
                                }
                            >
                                <option value="New">New</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditingTask(null)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <Container className="mt-4">
            <Navbar bg="light" expand="lg" className="mb-4">
                <Navbar.Brand href="#">Task Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Button variant="outline-danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Row className="justify-content-center mb-3">
                <Col xs="auto">
                    <Form.Group controlId="newTaskTitle">
                        <Form.Label>New Task Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Form.Group controlId="newTaskDescription">
                        <Form.Label>New Task Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto" className="d-flex align-items-end">
                    <Button onClick={handleAddTask}>Add</Button>
                </Col>
            </Row>
            <Row className="justify-content-center mb-3">
                <Col xs="auto">
                    <Form.Group controlId="filterStatus">
                        <Form.Label>Filter by status</Form.Label>
                        <Form.Control
                            as="select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'All' | 'New' | 'InProgress' | 'Completed')}
                        >
                            <option value="All">All</option>
                            <option value="New">New</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Form.Group controlId="sortOrder">
                        <Form.Label>Sort by date</Form.Label>
                        <Form.Control
                            as="select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        >
                            <option value="asc">Oldest to Newest</option>
                            <option value="desc">Newest to Oldest</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Creation Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{formatDate(task.createdDate)}</td>
                            <td>{task.status}</td>
                            <td>
                                <Button variant="warning" style={{ marginRight: '10px' }} onClick={() => handleEdit(task)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(task.id)}>
                                    Delete
                                </Button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>

            {renderEditModal()}
        </Container>
    );
};

export default Management;
