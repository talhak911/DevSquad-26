import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const loginSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/users/login', data);
            if (response.data.success) {
                toast.success(response.data.message || 'Logged in successfully!');
                login(response.data.data.token, response.data.data.user);
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <header className="flex items-center justify-between p-4 md:p-8">
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight">TaskManager</Link>
                <ThemeToggle />
            </header>

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="auth-container">
                    <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="john@example.com"
                                className="input-field"
                            />
                            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-placeholder hover:text-primary transition-colors focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
