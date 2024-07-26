
CREATE TABLE public.user_roles (
                                   user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
                                   role text NOT NULL,
                                   PRIMARY KEY (user_id)
);


CREATE OR REPLACE FUNCTION public.sync_user_roles()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role <> OLD.role THEN
UPDATE public.user_roles
SET role = NEW.role
WHERE user_id = NEW.user_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_role_update
    AFTER UPDATE OF role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_user_roles();


CREATE OR REPLACE FUNCTION public.create_user_role()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.user_roles (user_id, role)
VALUES (NEW.user_id, NEW.role);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_user_role();


CREATE POLICY select_profiles_for_admin
ON public.profiles
FOR SELECT
               USING (
               EXISTS (
               SELECT 1
               FROM public.user_roles
               WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
               )
               );


CREATE POLICY update_profiles_for_admin
ON public.profiles
FOR UPDATE
               USING (
               EXISTS (
               SELECT 1
               FROM public.user_roles
               WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
               )
               );


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;


INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role
FROM public.profiles
WHERE user_id NOT IN (SELECT user_id FROM public.user_roles);
