/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editedTasks, setEditedTasks] = useState<{ [id: number]: string }>({});

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    await handleFetchTasks();
  };

  const handleSave = async (id?: number) => {
    if (id) {
      const updatedTaskName = editedTasks[id];
      if (!updatedTaskName || tasks.find((task) => task.id === id)?.name === updatedTaskName) {
        return; // Prevent updating if name hasn't changed
      }
      await api.patch(`/tasks/${id}`, { name: updatedTaskName });
    } else {
      if (!newTaskName.trim()) return;
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName('');
    }
    await handleFetchTasks();
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
          <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
            <TextField
              size="small"
              value={editedTasks[task.id] ?? task.name}
              fullWidth
              sx={{ maxWidth: 350 }}
              onChange={(e) =>
                setEditedTasks((prev) => ({ ...prev, [task.id]: e.target.value }))
              }
            />
            <Box>
              <IconButton
                color="success"
                disabled={task.name === editedTasks[task.id]}
                onClick={() => handleSave(task.id)}
              >
                <Check />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <TextField
            size="small"
            value={newTaskName}
            fullWidth
            sx={{ maxWidth: 350 }}
            placeholder="Nouvelle tâche"
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <Button variant="outlined" onClick={() => handleSave()}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
