import { Form, useNavigation, useActionData, Navigate, redirect } from 'react-router-dom';
import axiosClient from '../API/axiosClient';
import {setAuth} from '../Models/Auth';

function Login() {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Please sign in to your account</p>
                </div>
                <Forms />
            </div>
        </div>
    );
}

export async function HandleSubmit({ request }) {
    const data = await request.formData();
    const { username, password } = Object.fromEntries(data);

    try {
        return await LoginAPI({username, password});
    } catch (error) {
        return { error: error.message || "Failed to login" };
    }
}

async function LoginAPI({username, password}){
    try{
        const response = await axiosClient.post('/auth/login', {username, password});
        const {token, role} = response.data
        setAuth(token, role);

        if(role === "admin"){
            return redirect('/AdminHome');
        }
        else if(role === "user"){
            return redirect('/UserHome');
        }

        return { success: true, message: `Success: ${response.data.message}` };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, message: 'Invalid username or password.' };
    }
    return { success: false, message: 'Failed to connect to the server.' };
  }
}

function Forms() {
    const navigation = useNavigation();
    const actionData = useActionData();
    const isLoading = navigation.state === 'submitting';

    return (
        <Form method='post' style={styles.form}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input 
                    id='username' 
                    name='username' 
                    type='text' 
                    disabled={isLoading} 
                    required 
                    style={styles.input}
                    placeholder="Enter your username"
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input 
                    id='pswd' 
                    name='password' 
                    type='password' 
                    disabled={isLoading} 
                    required 
                    style={styles.input}
                    placeholder="••••••••"
                />
            </div>
            
            {actionData?.error && (
                <div style={styles.errorBanner}>
                    {actionData.error}
                </div>
            )}

            <button 
                type='submit' 
                disabled={isLoading} 
                style={{
                    ...styles.button, 
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </Form>
    );
}

// Sleek charcoal dark mode styles with red accents
const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212', // Rich charcoal background
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '380px',
        padding: '32px',
        backgroundColor: '#1e1e1e', // Slightly lighter charcoal for the card
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
        border: '1px solid #2d2d2d',
    },
    header: {
        marginBottom: '24px',
        textAlign: 'center',
    },
    title: {
        margin: '0 0 6px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#f3f4f6',
    },
    subtitle: {
        margin: '0',
        fontSize: '14px',
        color: '#9ca3af',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#d1d5db',
    },
    input: {
        padding: '11px 14px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #404040',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        backgroundColor: '#262626',
        color: '#ffffff',
    },
    button: {
        marginTop: '6px',
        padding: '11px 16px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#dc2626', // Striking red accent
        border: 'none',
        borderRadius: '6px',
        transition: 'background-color 0.2s',
    },
    errorBanner: {
        padding: '10px 12px',
        fontSize: '13px',
        color: '#fca5a5',
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        borderRadius: '6px',
        textAlign: 'center',
    },
};

export default Login;