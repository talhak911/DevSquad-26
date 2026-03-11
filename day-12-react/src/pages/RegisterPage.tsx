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

const registerSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .matches(/^[A-Za-z\s]+$/, 'Name must contain only alphabetic characters and spaces'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
            'Must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/users/register', data);
            if (response.data.success) {
                toast.success(response.data.message || 'Account created successfully!');
                login(response.data.data.token, response.data.data.user);
                navigate('/');
            }
        } catch (error: any) {
            const errResponse = error.response?.data;
            let errorMsg = errResponse?.message || 'Registration failed';
            if (errResponse?.errors?.length > 0) {
                errorMsg = errResponse.errors.map((e: any) => e.message).join(', ');
            }
            toast.error(errorMsg);
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

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
                <div className="auth-container">
                    <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="John Doe"
                                className="input-field"
                            />
                            {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
                        </div>

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
                                'Register'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
