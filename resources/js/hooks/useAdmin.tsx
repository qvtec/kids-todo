import { User } from "@/types"

export default function useAdmin(user: User) {
  const isAdmin = user.role === 'admin'
  return isAdmin
}
