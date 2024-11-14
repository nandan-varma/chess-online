import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import firebase from '../lib/firebase';
import 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Link from 'next/link';

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      router.push('/');
    });
  };

  return (
    <AppBar className="w-full rounded-none" position="static">
      <Toolbar className="flex justify-between">
        <Link href={"/"}><h1>Chess Online</h1></Link>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button color="inherit">{user.email}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Log In</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
