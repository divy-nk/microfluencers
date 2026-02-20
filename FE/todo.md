# TODO List

- [x] Implement role-based routing using React Router
- [x] Create Brand and Creator dashboard pages
- [x] Use Supabase Auth context for user/role
- [x] Fetch user role from Supabase (profiles table)
- [x] Add ProtectedRoute for role-based access
- [x] Integrate AppRouter into App
- [ ] Add more dashboard features (future)
- [ ] Add tests for routing and dashboards (future)

## Notes
- See `src/AppRouter.tsx`, `src/BrandDashboard.tsx`, `src/CreatorDashboard.tsx`, `src/ProtectedRoute.tsx`, `src/useUserRole.tsx` for implementation.
- User role is fetched from the `profiles` table in Supabase.
- Update this list as new features are added.
