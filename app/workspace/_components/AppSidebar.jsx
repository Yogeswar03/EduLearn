"use client"

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Book,
  Compass,
  LayoutDashboard,
  PencilRuler,
  UserCircleIcon,
  Wallet2Icon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AddNewCourseDialog from './AddNewCourseDialog';
import { motion } from 'motion/react';

const SidebarOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace'
  },
  {
    title: 'My Learning',
    icon: Book,
    path: '/workspace/my-learning'
  },
  {
    title: 'Explore Courses',
    icon: Compass,
    path: '/workspace/explore'
  },
  {
    title: 'AI Tools',
    icon: PencilRuler,
    path: '/workspace/ai-tools'
  },
  {
    title: 'Billing',
    icon: Wallet2Icon,
    path: '/workspace/billing'
  },
  {
    title: 'My Profile',
    icon: UserCircleIcon,
    path: '/workspace/profile'
  },
];

function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="w-full sm:w-[260px]">
      <SidebarHeader className="p-4">
        <Image src="/edu_logo.png" alt="logo" width={200} height={45} priority />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <motion.div whileHover={{ scale: 1.03 }}>
            <AddNewCourseDialog>
              <Button className="w-full cursor-pointer">Create New Course</Button>
            </AddNewCourseDialog>
          </motion.div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="p-4 space-y-1">
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 hover:bg-purple-50 text-[16px] font-medium ${
                        path.includes(item.path) ? 'text-[#8338ec] bg-purple-100' : 'text-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
