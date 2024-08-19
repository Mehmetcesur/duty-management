import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import authService from '../../services/authService';
import dutyService from '../../services/dutyService'; // DutyService import ediliyor
import getListDutyResponse from '../../models/responses/duty/getListDutyResponse';

interface Task {
    id: number;
    title: string;
    description: string;
    createdDate: string; 
    status: 'New' | 'InProgress' | 'Completed';
}

const Management: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'All' | 'New' | 'InProgress' | 'Completed'>('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const user = authService.getUserInfo();
            console.log('User info:', user);

            if (!user || !user.id) {
                console.error('User ID is undefined or user information is missing:', user);
                return;
            }

            try {
                console.log('Fetching tasks for user ID:', user.id);
                const response = await dutyService.getTasksByUserId(user.id); // DutyService kullanılıyor

                console.log('API response:', response.data);

                if (response.data && Array.isArray(response.data.items)) {
                    const tasks: Task[] = response.data.items.map((item: getListDutyResponse) => {
                        let status: 'New' | 'InProgress' | 'Completed' = 'New';
                        if (['New', 'InProgress', 'Completed'].includes(item.status)) {
                            status = item.status as 'New' | 'InProgress' | 'Completed';
                        }
                        return {
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            createdDate: item.createdDate || new Date().toISOString().split('T')[0], // 'createdDate' kullanılıyor
                            status: status,
                        };
                    });
                    setTasks(tasks);
                } else {
                    console.error('Unexpected API response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const handleEdit = (id: number) => {
        console.log(`Edit task with id: ${id}`);
        // Düzenleme işlevini burada uygulayın
    };

    const handleDelete = (id: number) => {
        // Burada isterseniz API üzerinden silme işlemi yapabilirsiniz
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleAddTask = () => {
        const newTask: Task = {
            id: tasks.length + 1,
            title: newTaskTitle,
            description: newTaskDescription,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'New',
        };
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
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

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-center">Task Management</h1>
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
                            <td>{task.createdDate}</td>
                            <td>{task.status}</td>
                            <td>
                                <Button variant="warning" className="mr-2" onClick={() => handleEdit(task.id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Management;
