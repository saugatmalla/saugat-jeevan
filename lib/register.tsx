import { Dispatch, SetStateAction } from 'react';

interface HandleSubmitProps {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

export const registerUser = async (e: React.FormEvent, { email, firstName, lastName, phoneNumber, setMessage }: HandleSubmitProps) => {
    e.preventDefault();

    try {
        const url = '/api/register'
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName, phoneNumber }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            setMessage(`Error: ${errorData.message}`);
            return;
        }

        const data = await res.json();
        setMessage(data.message);
    } catch (error) {
        console.error('Error during registration:', error);
        setMessage('An unexpected error occurred.');
    }
};