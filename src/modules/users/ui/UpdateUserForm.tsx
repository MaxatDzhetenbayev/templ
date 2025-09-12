"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { useUpdateUserProfile } from "../application/use-cases/update-user-profile";
import { IUser } from "../types";
import { useUpdatePet } from '@/shared/api/generated';

export const UpdateUserForm = () => {
  const { register, handleSubmit, reset } = useForm<IUser>();
  const { mutate } = useUpdateUserProfile({ reset });
	useUpdatePet()

  return (
    <form
      className="my-6"
      onSubmit={handleSubmit((data: Partial<IUser>) => mutate(data))}
    >
      <input {...register("name")} placeholder="Name" />
      <input {...register("email")} placeholder="Email" />
      <button type="submit" className="cursor-pointer">
        Обновить данные профиля
      </button>
    </form>
  );
};
