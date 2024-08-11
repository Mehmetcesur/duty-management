import React, { useState } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';

interface Task {
    id: number;
    title: string;
    description: string;
    creationDate: string;
    status: 'New' | 'In Progress' | 'Completed';
}

const Management: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Task 1', description: 'Description 1', creationDate: '2024-08-10', status: 'New' },
        { id: 2, title: 'Task 2', description: 'Description 2', creationDate: '2024-08-11', status: 'In Progress' },
    ]);

    const [filter, setFilter] = useState<'All' | 'New' | 'In Progress' | 'Completed'>('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleEdit = (id: number) => {
        console.log(`Edit task with id: ${id}`);
    };

    const handleDelete = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const filteredTasks = tasks
        .filter(task => filter === 'All' || task.status === filter)
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
            } else {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
            }
        });

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-center">Task Management</h1>
            <Row className="justify-content-center mb-3">
                <Col xs="auto">
                    <Form.Group controlId="filterStatus">
                        <Form.Label>Filter by status</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value as 'All' | 'New' | 'In Progress' | 'Completed')}
                        >
                            <option value="All">All</option>
                            <option value="Pending">New</option>
                            <option value="In Progress">In Progress</option>
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
                            <td>{task.creationDate}</td>
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
