import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, CheckCircle, Circle, Plus, Edit2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

interface Task {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: string;
}

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [addingTask, setAddingTask] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [stats, setStats] = useState({ completed: 0, pending: 0 });

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            if (response.data.success) {
                setTasks(response.data.data.tasks);
            }
        } catch (error) {
            toast.error('Failed to load tasks');
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/tasks/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load stats', error);
        }
    };

    const loadInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchTasks(), fetchStats()]);
        setLoading(false);
    };

    useEffect(() => {
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setAddingTask(true);
        try {
            const response = await api.post('/tasks', { title: newTaskTitle, completed: false });
            if (response.data.success) {
                const newTask = response.data.data.task;
                setTasks(prevTasks => [newTask, ...prevTasks]);
                setStats(prevStats => ({ ...prevStats, pending: prevStats.pending + 1 }));
                setNewTaskTitle('');
                toast.success('Task added');
            }
        } catch (error) {
            toast.error('Failed to add task');
        } finally {
            setAddingTask(false);
        }
    };

    const toggleTask = async (id: string, isCompleted: boolean) => {
        // Optimistic UI update
        setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
        setStats(prevStats => ({
            ...prevStats,
            completed: isCompleted ? prevStats.completed - 1 : prevStats.completed + 1,
            pending: isCompleted ? prevStats.pending + 1 : prevStats.pending - 1
        }));

        try {
            await api.put(`/tasks/${id}`, { completed: !isCompleted });
        } catch (error) {
            toast.error('Failed to update task');
            // Revert if failed
            setTasks(tasks.map(t => t._id === id ? { ...t, completed: isCompleted } : t));
            fetchStats(); // recover stats
        }
    };

    const deleteTask = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        const taskToDelete = tasks.find(t => t._id === id);
        const previousTasks = [...tasks];

        // Optimistic delete
        setTasks(tasks.filter(t => t._id !== id));
        if (taskToDelete) {
            setStats(prevStats => ({
                ...prevStats,
                completed: taskToDelete.completed ? prevStats.completed - 1 : prevStats.completed,
                pending: !taskToDelete.completed ? prevStats.pending - 1 : prevStats.pending
            }));
        }

        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
            setTasks(previousTasks);
            fetchStats(); // recover stats
        }
    };

    const startEditing = (task: Task) => {
        if (task.completed) return;
        setEditingTaskId(task._id);
        setEditTaskTitle(task.title);
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditTaskTitle('');
    };

    const handleEditTask = async (id: string, e: React.FormEvent) => {
        e.preventDefault();
        const task = tasks.find(t => t._id === id);
        if (!task || !editTaskTitle.trim() || editTaskTitle.trim() === task.title) {
            cancelEditing();
            return;
        }

        const newTitle = editTaskTitle.trim();
        const previousTasks = [...tasks];

        // Optimistic update
        setTasks(tasks.map(t => t._id === id ? { ...t, title: newTitle } : t));
        cancelEditing();

        try {
            await api.put(`/tasks/${id}`, { title: newTitle });
            toast.success('Task updated');
        } catch (error) {
            toast.error('Failed to update task');
            setTasks(previousTasks);
        }
    };

    return (
        <>
            <header className="flex items-center justify-between p-4 lg:px-6 mb-4 lg:mb-8 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-primary tracking-tight">TaskManager</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline font-medium capitalize text-sm">Hello, {user?.name?.split(' ')[0]}</span>
                    <ThemeToggle />
                    <button onClick={logout} className="btn-outline px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
                    <div className="text-sm font-medium text-[var(--color-placeholder)] px-4 py-2 bg-[var(--color-input-bg-light)] dark:bg-[var(--color-input-bg-dark)] rounded-full shadow-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                        <span className="text-primary">{stats.completed}</span> concluded &bull; <span className="text-yellow-500">{stats.pending}</span> pending
                    </div>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="input-field flex-1 !py-4 shadow-sm text-lg"
                    />
                    <button
                        type="submit"
                        disabled={addingTask || !newTaskTitle.trim()}
                        className="btn btn-primary !w-auto !px-6 disabled:opacity-70 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Task</span>
                    </button>
                </form>

                <section className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center p-12 card border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm">
                            <p className="text-[var(--color-placeholder)] text-lg mb-2">You don't have any tasks currently</p>
                            <p className="text-sm text-placeholder opacity-70">Focus on what matters next.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                className={`card flex items-center justify-between p-4 px-6 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] group transition-all duration-300 ${task.completed ? 'opacity-70' : ''}`}
                            >
                                {editingTaskId === task._id ? (
                                    <form onSubmit={(e) => handleEditTask(task._id, e)} className="flex-1 flex items-center gap-3 w-full">
                                        <input
                                            type="text"
                                            value={editTaskTitle}
                                            onChange={(e) => setEditTaskTitle(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-primary rounded-lg bg-input-bg-light dark:bg-input-bg-dark text-lg outline-none"
                                            autoFocus
                                        />
                                        <button type="submit" className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors" title="Save">
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button type="button" onClick={cancelEditing} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Cancel">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <div
                                            className="flex items-center gap-4 flex-1 cursor-pointer overflow-hidden"
                                            onClick={() => toggleTask(task._id, task.completed)}
                                        >
                                            <button className="text-placeholder hover:text-primary transition-colors focus:outline-none focus:text-primary shrink-0" onClick={(e) => { e.stopPropagation(); toggleTask(task._id, task.completed); }}>
                                                {task.completed ? (
                                                    <CheckCircle className="w-6 h-6 text-primary" />
                                                ) : (
                                                    <Circle className="w-6 h-6" />
                                                )}
                                            </button>
                                            <span className={`text-lg transition-colors truncate ${task.completed ? 'line-through text-placeholder' : 'font-medium'}`}>
                                                {task.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                                            {!task.completed && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startEditing(task); }}
                                                    className="p-2 text-placeholder hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:opacity-100 focus:outline-primary"
                                                    title="Edit Task"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                                                className="p-2 text-placeholder hover:text-danger hover:bg-danger/10 rounded-lg transition-all focus:opacity-100 focus:outline-danger"
                                                title="Delete Task"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
};

export default DashboardPage;
