import * as bcrypt from 'bcrypt';
interface SeedUser {
    name: string;
    lastname: string;
    email: string;
    avatar: string;
    gender: "male" | "female"
    password: string;
    role: any;   
}


interface SeedRoles {
    name: string; 
}

interface SeedData {
    roles: SeedRoles[];
    users: SeedUser[];
}

export const initialData: SeedData = {
    roles: [
        {
            name: "admin",
        },
        {
            name: "employee",
        },
        {
            name: "user",
        }
    ],

    users: [
        {
            avatar: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            gender: "male",
            lastname: "Duarte",
            name: "Mattias",
            password: bcrypt.hashSync( "Admin123", 10 ),
            role: null,
            email: 'admin@correo.com',
        }
    ],
}