import { FormEvent, ReactNode, useMemo, useState } from "react";

type Screen =
  | "welcome"
  | "login"
  | "register"
  | "home"
  | "calendar"
  | "baby"
  | "info"
  | "profile"
  | "reminders"
  | "mental"
  | "article";

type Reminder = {
  id: number;
  title: string;
  date: string;
  time: string;
  done: boolean;
};

type EventType = "Consulta" | "Exame" | "Vacina" | "Lembrete";
type CalendarEvent = {
  id: number;
  title: string;
  type: EventType;
  day: number;
  time: string;
  notes?: string;
};

const colors: Record<EventType, string> = {
  Consulta: "#E9A8B9",
  Exame: "#A99ACB",
  Vacina: "#A9C9B4",
  Lembrete: "#E6B87A",
};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const articles = [
  {
    id: "alimentacao",
    icon: "apple",
    color: "bg-[#FFF0F3]",
    title: "Alimentação",
    description: "Nutrientes importantes e escolhas seguras para cada fase.",
    read: "4 min",
  },
  {
    id: "sono",
    icon: "moon",
    color: "bg-[#F2EFF9]",
    title: "Sono e descanso",
    description: "Posições confortáveis e uma rotina para noites mais tranquilas.",
    read: "3 min",
  },
  {
    id: "exercicios",
    icon: "activity",
    color: "bg-[#EDF6F0]",
    title: "Movimento seguro",
    description: "Atividades leves que ajudam no bem-estar durante a gestação.",
    read: "5 min",
  },
  {
    id: "consultas",
    icon: "stethoscope",
    color: "bg-[#FFF6E8]",
    title: "Pré-natal",
    description: "O que esperar das consultas e como se preparar.",
    read: "4 min",
  },
  {
    id: "exames",
    icon: "file",
    color: "bg-[#EFF3FA]",
    title: "Exames",
    description: "Um guia simples sobre os exames de cada trimestre.",
    read: "6 min",
  },
];

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    baby: (
      <>
        <path d="M9 3.5a3 3 0 0 1 5.6 1.5c0 .4-.1.8-.2 1.2a6.8 6.8 0 1 1-8 1.6" />
        <circle cx="9.5" cy="12" r=".7" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="12" r=".7" fill="currentColor" stroke="none" />
        <path d="M9 15c1.5 1.2 4.5 1.2 6 0" />
      </>
    ),
    book: (
      <>
        <path d="M4 4h5a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-5a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h5z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    apple: (
      <>
        <path d="M12 7c-2-2.5-6-1.5-7 1.5C3.5 13 7 20 10 20c1 0 1.2-.5 2-.5s1 .5 2 .5c3 0 6.5-7 5-11.5C18 5.5 14 4.5 12 7Z" />
        <path d="M12 7c0-2 1-3.5 3-4" />
      </>
    ),
    moon: <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />,
    activity: <path d="M3 12h4l2-5 4 10 2-5h6" />,
    stethoscope: (
      <>
        <path d="M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 12v2a5 5 0 0 0 10 0v-1" />
        <circle cx="20" cy="11" r="2" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.8-1L14.4 3h-4L10 6a7 7 0 0 0-1.8 1L6 6.1 4 9.5 6.1 11a7 7 0 0 0 0 2L4 14.5 6 18l2.3-1a7 7 0 0 0 1.8 1l.4 3h4l.4-3a7 7 0 0 0 1.8-1l2.3 1 2-3.5-2.1-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    logout: <path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
      </>
    ),
    edit: (
      <>
        <path d="m4 16-1 5 5-1L19 9l-4-4zM13 7l4 4" />
      </>
    ),
    spark: <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />,
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.heart}
    </svg>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${small ? "" : "justify-center"}`}>
      <span
        className={`${small ? "h-8 w-8" : "h-10 w-10"} flex items-center justify-center rounded-2xl bg-[#E9A8B9] text-white`}
      >
        <Icon name="heart" size={small ? 17 : 21} />
      </span>
      <span
        className={`${small ? "text-xl" : "text-[26px]"} font-extrabold tracking-[-.04em] text-[#514B55]`}
      >
        Gestar<span className="text-[#A99ACB]">+</span>
      </span>
    </div>
  );
}

function Button({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "soft" | "ghost";
  className?: string;
}) {
  const variants = {
    primary: "bg-[#A8697B] text-white shadow-[0_6px_18px_rgba(168,105,123,.22)]",
    soft: "bg-[#F8E8ED] text-[#8E5667]",
    ghost: "bg-transparent text-[#766E78]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex h-13 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold transition active:scale-[.98] disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-[#655E67]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        aria-invalid={!!error}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-[15px] outline-none transition placeholder:text-[#B7AFB7] focus:border-[#A99ACB] focus:ring-3 focus:ring-[#A99ACB]/15 ${
          error ? "border-[#C96872]" : "border-[#E9E4E8]"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-[#B74E5A]">{error}</span>}
    </label>
  );
}

function Header({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-5">
      <div className="flex min-w-0 items-center gap-2.5">
        {onBack && (
          <button
            aria-label="Voltar"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#514B55] shadow-sm"
          >
            <Icon name="chevronLeft" />
          </button>
        )}
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-.03em] text-[#514B55]">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-[#8A828A]">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}

function BottomNav({ active, go }: { active: Screen; go: (screen: Screen) => void }) {
  const items: { label: string; screen: Screen; icon: string }[] = [
    { label: "Início", screen: "home", icon: "home" },
    { label: "Calendário", screen: "calendar", icon: "calendar" },
    { label: "Meu bebê", screen: "baby", icon: "baby" },
    { label: "Informações", screen: "info", icon: "book" },
    { label: "Perfil", screen: "profile", icon: "user" },
  ];
  return (
    <nav
      aria-label="Navegação principal"
      className="absolute inset-x-0 bottom-0 z-30 flex h-[78px] items-start justify-around border-t border-[#EEE8EC] bg-white/95 px-1 pt-2 backdrop-blur"
    >
      {items.map((item) => {
        const selected =
          active === item.screen ||
          (item.screen === "info" && (active === "article" || active === "mental"));
        return (
          <button
            key={item.screen}
            aria-current={selected ? "page" : undefined}
            onClick={() => go(item.screen)}
            className={`flex min-w-[68px] flex-col items-center gap-1 rounded-xl py-1 text-[10px] font-bold transition ${
              selected ? "text-[#A86679]" : "text-[#9C949C]"
            }`}
          >
            <span className={`rounded-xl p-1 ${selected ? "bg-[#FAE9EE]" : ""}`}>
              <Icon name={item.icon} size={20} />
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function AppShell({
  children,
  screen,
  go,
}: {
  children: ReactNode;
  screen: Screen;
  go: (s: Screen) => void;
}) {
  return (
    <main className="app-shell">
      <div className="h-full overflow-y-auto pb-[92px]">{children}</div>
      <BottomNav active={screen} go={go} />
    </main>
  );
}

function Welcome({ go }: { go: (s: Screen) => void }) {
  return (
    <main className="app-shell overflow-hidden bg-[#FFF9FA]">
      <div className="relative h-[47%]">
        <img
          src="https://images.unsplash.com/photo-1489674297774-eadf82cba14c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900"
          alt="Gestante sorrindo e acariciando a barriga"
          className="h-full w-full object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9FA] via-transparent to-[#5C4550]/10" />
        <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <Logo small />
        </div>
        <span className="absolute bottom-4 right-5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold text-[#766E78] backdrop-blur">
          Cuidado em cada semana
        </span>
      </div>
      <div className="px-7 pt-2 text-center">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E9A8B9]" />
        <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-[-.04em] text-[#514B55]">
          Uma jornada especial merece cuidado em cada etapa.
        </h1>
        <p className="mx-auto mt-4 max-w-[320px] text-[14px] leading-6 text-[#7D757E]">
          Acompanhe o crescimento do seu bebê, organize o pré-natal e cuide de você com mais
          tranquilidade.
        </p>
        <Button onClick={() => go("register")} className="mt-7 w-full">
          Começar agora <Icon name="chevronRight" size={18} />
        </Button>
        <button onClick={() => go("login")} className="mt-4 text-sm font-bold text-[#8E6170]">
          Já tenho uma conta
        </button>
      </div>
    </main>
  );
}

function Login({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Confira seu e-mail e use uma senha com pelo menos 6 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      go("home");
    }, 900);
  }

  return (
    <main className="app-shell bg-[#FFF9FA] px-6 pt-5">
      <button
        aria-label="Voltar"
        onClick={() => go("welcome")}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <Icon name="chevronLeft" />
      </button>
      <div className="mt-8">
        <Logo />
        <h1 className="mt-9 text-[27px] font-extrabold tracking-[-.04em] text-[#514B55]">
          Que bom ter você aqui
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#857D85]">
          Entre para continuar acompanhando sua gestação.
        </p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          placeholder="voce@exemplo.com"
          type="email"
        />
        <Field
          label="Senha"
          value={password}
          onChange={setPassword}
          placeholder="Sua senha"
          type="password"
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-bold text-[#946173]"
            onClick={() => setError("Enviamos as instruções para o seu e-mail.")}
          >
            Esqueci minha senha
          </button>
        </div>
        {error && (
          <div
            role="status"
            className="rounded-2xl bg-[#FFF0F2] px-4 py-3 text-xs font-semibold leading-5 text-[#A95663]"
          >
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-[#817981]">
        Ainda não tem uma conta?{" "}
        <button onClick={() => go("register")} className="font-extrabold text-[#966174]">
          Cadastre-se
        </button>
      </p>
      <div className="absolute bottom-5 left-0 w-full px-6 text-center text-[11px] leading-4 text-[#A39BA3]">
        Seus dados de saúde são privados e protegidos.
      </div>
    </main>
  );
}

function Register({ go }: { go: (s: Screen) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof typeof form) => (value: string) => setForm({ ...form, [key]: value });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name || !form.email.includes("@") || form.password.length < 6 || !form.dueDate) {
      setError("Preencha todos os campos e use uma senha com 6 ou mais caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("As senhas informadas não são iguais.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      go("home");
    }, 900);
  }

  return (
    <main className="app-shell overflow-y-auto bg-[#FFF9FA]">
      <Header
        title="Crie sua conta"
        subtitle="Leva menos de 2 minutos"
        onBack={() => go("welcome")}
      />
      <form onSubmit={submit} className="space-y-4 px-5 pb-8 pt-2" noValidate>
        <Field
          label="Nome"
          value={form.name}
          onChange={set("name")}
          placeholder="Como podemos chamar você?"
        />
        <Field
          label="E-mail"
          value={form.email}
          onChange={set("email")}
          placeholder="voce@exemplo.com"
          type="email"
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Senha"
            value={form.password}
            onChange={set("password")}
            placeholder="Mín. 6 dígitos"
            type="password"
          />
          <Field
            label="Confirmar senha"
            value={form.confirm}
            onChange={set("confirm")}
            placeholder="Repita a senha"
            type="password"
          />
        </div>
        <Field
          label="Data provável do parto"
          value={form.dueDate}
          onChange={set("dueDate")}
          type="date"
        />
        <p className="rounded-2xl bg-[#F0F6F2] px-4 py-3 text-xs leading-5 text-[#607568]">
          <strong>Não sabe a data?</strong> Você poderá informar a idade gestacional e ajustar
          depois no perfil.
        </p>
        {error && (
          <div
            role="alert"
            className="rounded-2xl bg-[#FFF0F2] px-4 py-3 text-xs font-semibold text-[#A95663]"
          >
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Criando sua conta..." : "Criar conta"}
        </Button>
        <p className="px-4 text-center text-[11px] leading-4 text-[#9B939B]">
          Ao continuar, você concorda com os Termos de uso e a Política de privacidade.
        </p>
      </form>
    </main>
  );
}

function Home({ go }: { go: (s: Screen) => void }) {
  const quick = [
    {
      title: "Calendário",
      subtitle: "Organize seu pré-natal",
      icon: "calendar",
      color: "bg-[#FFF0F3]",
      screen: "calendar" as Screen,
    },
    {
      title: "Lembretes",
      subtitle: "2 pendentes hoje",
      icon: "bell",
      color: "bg-[#F2EFF9]",
      screen: "reminders" as Screen,
    },
    {
      title: "Informações",
      subtitle: "Conteúdo confiável",
      icon: "book",
      color: "bg-[#EDF6F0]",
      screen: "info" as Screen,
    },
    {
      title: "Meu bebê",
      subtitle: "Veja o que mudou",
      icon: "baby",
      color: "bg-[#FFF6E8]",
      screen: "baby" as Screen,
    },
  ];
  return (
    <AppShell screen="home" go={go}>
      <div className="bg-gradient-to-b from-[#FCECF1] to-[#FFF9FA] px-5 pb-5 pt-5">
        <div className="flex items-center justify-between">
          <Logo small />
          <button
            aria-label="Notificações"
            onClick={() => go("reminders")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <Icon name="bell" size={19} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#C9677B]" />
          </button>
        </div>
        <p className="mt-7 text-[13px] font-semibold text-[#8A7880]">Bom dia, Mariana</p>
        <h1 className="mt-1 text-[27px] font-extrabold tracking-[-.04em] text-[#514B55]">
          Sua 24ª semana
        </h1>
        <div className="mt-5 rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgba(94,70,80,.07)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.12em] text-[#A86679]">
                2º trimestre
              </span>
              <p className="mt-1 text-sm font-bold text-[#514B55]">Faltam cerca de 16 semanas</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1EDF8] text-[#8776AF]">
              <Icon name="baby" size={25} />
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F2EDF0]">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#E9A8B9] to-[#A99ACB]" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#9A929A]">
            <span>Início</span>
            <span>60% da jornada</span>
            <span>40 semanas</span>
          </div>
        </div>
      </div>

      <section className="px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-[#514B55]">Próximo compromisso</h2>
          <button onClick={() => go("calendar")} className="text-xs font-bold text-[#996478]">
            Ver agenda
          </button>
        </div>
        <button
          onClick={() => go("calendar")}
          className="mt-3 flex w-full items-center gap-4 rounded-[22px] border border-[#F1E9ED] bg-white p-4 text-left shadow-[0_5px_20px_rgba(94,70,80,.05)]"
        >
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F8E8ED] text-[#9D6073]">
            <span className="text-[10px] font-extrabold uppercase">Jun</span>
            <span className="text-xl font-extrabold leading-5">18</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A86679]">
              Consulta
            </span>
            <p className="truncate text-sm font-extrabold text-[#514B55]">
              Pré-natal com Dra. Camila
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#8E858E]">
              <Icon name="clock" size={13} /> 09:30 · Clínica Bem Nascer
            </p>
          </div>
          <Icon name="chevronRight" size={18} className="text-[#B0A8AF]" />
        </button>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-[17px] font-extrabold text-[#514B55]">Acesso rápido</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {quick.map((item) => (
            <button
              key={item.title}
              onClick={() => go(item.screen)}
              className="rounded-[20px] border border-[#F1EAED] bg-white p-3.5 text-left transition active:scale-[.98]"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} text-[#796F78]`}
              >
                <Icon name={item.icon} size={18} />
              </span>
              <p className="mt-3 text-[13px] font-extrabold text-[#514B55]">{item.title}</p>
              <p className="mt-0.5 text-[10px] text-[#938B93]">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </section>
      <button
        onClick={() => go("mental")}
        className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center gap-3 rounded-[20px] bg-[#F2EFF9] p-4 text-left"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8776AF]">
          <Icon name="heart" size={19} />
        </span>
        <span className="flex-1">
          <strong className="block text-sm text-[#514B55]">Como você está se sentindo?</strong>
          <small className="text-[#82788B]">Reserve um momento para você</small>
        </span>
        <Icon name="chevronRight" size={18} />
      </button>
    </AppShell>
  );
}

function CalendarScreen({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [month, setMonth] = useState(5);
  const [selectedDay, setSelectedDay] = useState(18);
  const [showAdd, setShowAdd] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: "Ultrassom morfológico", type: "Exame", day: 8, time: "14:00" },
    { id: 2, title: "Pré-natal com Dra. Camila", type: "Consulta", day: 18, time: "09:30" },
    { id: 3, title: "Vacina dTpa", type: "Vacina", day: 26, time: "11:00" },
  ]);
  const [draft, setDraft] = useState({
    title: "",
    type: "Consulta" as EventType,
    date: "2025-06-18",
    time: "09:00",
    notes: "",
  });
  const startOffset = 0;
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const selectedEvents = events.filter((event) => event.day === selectedDay);

  function addEvent(event: FormEvent) {
    event.preventDefault();
    if (!draft.title) return;
    const day = Number(draft.date.split("-")[2]) || selectedDay;
    setEvents([
      ...events,
      {
        id: Date.now(),
        title: draft.title,
        type: draft.type,
        day,
        time: draft.time,
        notes: draft.notes,
      },
    ]);
    setSelectedDay(day);
    setShowAdd(false);
    setDraft({ ...draft, title: "", notes: "" });
    notify("Compromisso adicionado à sua agenda.");
  }

  return (
    <AppShell screen="calendar" go={go}>
      <Header
        title="Calendário"
        subtitle="Sua rotina de cuidados"
        action={
          <button
            aria-label="Adicionar compromisso"
            onClick={() => setShowAdd(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A8697B] text-white shadow-sm"
          >
            <Icon name="plus" />
          </button>
        }
      />
      <div className="mx-5 rounded-[24px] bg-white p-4 shadow-[0_8px_28px_rgba(94,70,80,.07)]">
        <div className="flex items-center justify-between">
          <button
            aria-label="Mês anterior"
            onClick={() => setMonth(Math.max(0, month - 1))}
            className="p-2"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <select
            aria-label="Selecionar mês"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-transparent text-sm font-extrabold text-[#514B55] outline-none"
          >
            {months.map((name, index) => (
              <option value={index} key={name}>
                {name} 2025
              </option>
            ))}
          </select>
          <button
            aria-label="Próximo mês"
            onClick={() => setMonth(Math.min(11, month + 1))}
            className="p-2"
          >
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-extrabold uppercase text-[#A39BA3]">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
            <span key={`${day}${i}`}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: startOffset }).map((_, index) => (
            <span key={`empty${index}`} />
          ))}
          {days.map((day) => {
            const dayEvents = events.filter((event) => event.day === day);
            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  notify(`Dia ${day} selecionado.`);
                }}
                className={`relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-xl text-xs font-bold transition ${selectedDay === day ? "bg-[#A8697B] text-white shadow-md" : "text-[#655E67] hover:bg-[#FAEFF2]"}`}
              >
                {day}
                {dayEvents.length > 0 && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${selectedDay === day ? "bg-white" : ""}`}
                    style={
                      selectedDay !== day ? { background: colors[dayEvents[0].type] } : undefined
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
        {(Object.keys(colors) as EventType[]).map((type) => (
          <span
            key={type}
            className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[#827A82]"
          >
            <i className="h-2 w-2 rounded-full" style={{ background: colors[type] }} />
            {type}
          </span>
        ))}
      </div>
      <section className="mt-5 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#514B55]">
            {selectedDay} de {months[month].toLowerCase()}
          </h2>
          <button onClick={() => setShowAdd(true)} className="text-xs font-bold text-[#996478]">
            + Adicionar
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {selectedEvents.length ? (
            selectedEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-[18px] border border-[#F0E9ED] bg-white p-3.5"
              >
                <span
                  className="h-10 w-1 rounded-full"
                  style={{ background: colors[event.type] }}
                />
                <div className="flex-1">
                  <span
                    className="text-[10px] font-extrabold uppercase"
                    style={{ color: colors[event.type] }}
                  >
                    {event.type}
                  </span>
                  <p className="text-sm font-extrabold text-[#514B55]">{event.title}</p>
                </div>
                <span className="text-xs font-bold text-[#817981]">{event.time}</span>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#DDD4DA] p-6 text-center">
              <Icon name="calendar" size={25} className="mx-auto text-[#B1A6AE]" />
              <p className="mt-2 text-sm font-bold text-[#746D75]">Nenhum compromisso neste dia</p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-2 text-xs font-extrabold text-[#996478]"
              >
                Adicionar à agenda
              </button>
            </div>
          )}
        </div>
      </section>

      {showAdd && (
        <div
          className="absolute inset-0 z-50 flex items-end bg-[#342A31]/35"
          role="dialog"
          aria-modal="true"
          aria-label="Novo compromisso"
        >
          <form
            onSubmit={addEvent}
            className="max-h-[90%] w-full overflow-y-auto rounded-t-[30px] bg-[#FFF9FA] p-5 pb-8 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D7CED4]" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Novo compromisso</h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="h-9 w-9 rounded-full bg-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <Field
                label="Título"
                value={draft.title}
                onChange={(value) => setDraft({ ...draft, title: value })}
                placeholder="Ex.: Consulta de pré-natal"
              />
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-bold">Tipo</span>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value as EventType })}
                  className="h-12 w-full rounded-2xl border border-[#E9E4E8] bg-white px-4 text-sm outline-none"
                >
                  {Object.keys(colors).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <Field
                  label="Data"
                  type="date"
                  value={draft.date}
                  onChange={(value) => setDraft({ ...draft, date: value })}
                />
                <Field
                  label="Hora"
                  type="time"
                  value={draft.time}
                  onChange={(value) => setDraft({ ...draft, time: value })}
                />
              </div>
              <Field
                label="Observações"
                value={draft.notes}
                onChange={(value) => setDraft({ ...draft, notes: value })}
                placeholder="Local, preparo ou orientação"
              />
              <Button type="submit" className="w-full">
                Salvar compromisso
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

function Reminders({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [items, setItems] = useState<Reminder[]>([
    { id: 1, title: "Tomar vitamina pré-natal", date: "Hoje", time: "08:00", done: true },
    { id: 2, title: "Separar exames para a consulta", date: "Hoje", time: "19:00", done: false },
    { id: 3, title: "Beber mais água", date: "Amanhã", time: "09:00", done: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ title: "", date: "2025-06-17", time: "09:00" });

  function add(event: FormEvent) {
    event.preventDefault();
    if (!draft.title) return;
    setItems([
      ...items,
      { id: Date.now(), title: draft.title, date: "17 jun", time: draft.time, done: false },
    ]);
    setDraft({ ...draft, title: "" });
    setShowAdd(false);
    notify("Lembrete criado com sucesso.");
  }
  function toggle(id: number) {
    setItems(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
    notify("Lembrete atualizado.");
  }

  return (
    <AppShell screen="reminders" go={go}>
      <Header
        title="Lembretes"
        subtitle={`${items.filter((item) => !item.done).length} pendentes`}
        onBack={() => go("home")}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A8697B] text-white"
          >
            <Icon name="plus" />
          </button>
        }
      />
      <div className="px-5 pt-2">
        <div className="rounded-[20px] bg-[#F1EDF8] p-4">
          <p className="text-sm font-extrabold text-[#61576B]">Um cuidado de cada vez</p>
          <p className="mt-1 text-xs leading-5 text-[#81768A]">
            Pequenos lembretes ajudam você a manter sua rotina mais leve.
          </p>
        </div>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-[20px] border bg-white p-3.5 ${item.done ? "border-[#DFEAE2] opacity-70" : "border-[#F0E9ED]"}`}
            >
              <button
                aria-label={item.done ? "Marcar como pendente" : "Marcar como concluído"}
                onClick={() => toggle(item.id)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${item.done ? "border-[#86AF94] bg-[#A9C9B4] text-white" : "border-[#D9CFD5]"}`}
              >
                {item.done && <Icon name="check" size={15} />}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-extrabold text-[#514B55] ${item.done ? "line-through" : ""}`}
                >
                  {item.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#8C848C]">
                  <Icon name="clock" size={12} /> {item.date}, {item.time}
                </p>
              </div>
              <button
                aria-label="Editar lembrete"
                onClick={() => {
                  setDraft({ title: item.title, date: "2025-06-17", time: item.time });
                  setShowAdd(true);
                }}
                className="p-1.5 text-[#9C9299]"
              >
                <Icon name="edit" size={16} />
              </button>
              <button
                aria-label="Excluir lembrete"
                onClick={() => {
                  setItems(items.filter((i) => i.id !== item.id));
                  notify("Lembrete removido.");
                }}
                className="p-1.5 text-[#B4717C]"
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
          {!items.length && (
            <div className="py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F6EBEF] text-[#A86B7C]">
                <Icon name="bell" size={28} />
              </span>
              <h3 className="mt-4 font-extrabold">Tudo em dia por aqui</h3>
              <p className="mt-1 text-sm text-[#8C848C]">Crie um lembrete quando precisar.</p>
            </div>
          )}
        </div>
      </div>
      {showAdd && (
        <div className="absolute inset-0 z-50 flex items-end bg-[#342A31]/35">
          <form onSubmit={add} className="w-full rounded-t-[30px] bg-[#FFF9FA] p-5 pb-8">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D7CED4]" />
            <div className="flex justify-between">
              <h2 className="text-xl font-extrabold">Novo lembrete</h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="h-9 w-9 rounded-full bg-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <Field
                label="Lembrete"
                value={draft.title}
                onChange={(title) => setDraft({ ...draft, title })}
                placeholder="O que você não quer esquecer?"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Data"
                  type="date"
                  value={draft.date}
                  onChange={(date) => setDraft({ ...draft, date })}
                />
                <Field
                  label="Hora"
                  type="time"
                  value={draft.time}
                  onChange={(time) => setDraft({ ...draft, time })}
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar lembrete
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

function Info({ go }: { go: (s: Screen) => void }) {
  return (
    <AppShell screen="info" go={go}>
      <Header title="Informações" subtitle="Conteúdo para uma gestação tranquila" />
      <div className="px-5">
        <button
          onClick={() => go("mental")}
          className="relative w-full overflow-hidden rounded-[24px] bg-gradient-to-r from-[#A99ACB] to-[#C8BEE0] p-5 text-left text-white"
        >
          <Icon name="heart" size={25} />
          <h2 className="mt-5 text-lg font-extrabold">Sua saúde emocional importa</h2>
          <p className="mt-1 max-w-[260px] text-xs leading-5 text-white/85">
            Acolhimento, respiração e sinais para observar.
          </p>
          <span className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/10" />
        </button>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold">Explore por tema</h2>
          <span className="text-xs text-[#928A92]">5 categorias</span>
        </div>
        <div className="mt-3 space-y-3">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => go("article")}
              className="flex w-full items-center gap-3 rounded-[20px] border border-[#F0E9ED] bg-white p-3.5 text-left"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${article.color} text-[#756C74]`}
              >
                <Icon name={article.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm text-[#514B55]">{article.title}</strong>
                <small className="mt-0.5 line-clamp-2 block leading-4 text-[#8A828A]">
                  {article.description}
                </small>
                <small className="mt-1 block font-bold text-[#A06879]">
                  {article.read} de leitura
                </small>
              </span>
              <Icon name="chevronRight" size={17} className="text-[#AAA1A8]" />
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-[20px] border border-[#E5EEDF] bg-[#F5F9F6] p-4 text-xs leading-5 text-[#66746B]">
          <strong>Informação com cuidado.</strong> Este conteúdo é educativo e não substitui a
          orientação da sua equipe de saúde.
        </div>
      </div>
    </AppShell>
  );
}

function Article({ go }: { go: (s: Screen) => void }) {
  return (
    <AppShell screen="article" go={go}>
      <Header title="Alimentação" subtitle="4 min de leitura" onBack={() => go("info")} />
      <article className="px-5">
        <div className="rounded-[24px] bg-[#FFF0F3] p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#9B6675]">
            <Icon name="apple" size={23} />
          </span>
          <h2 className="mt-5 text-[23px] font-extrabold leading-7 tracking-[-.03em]">
            Nutrientes que acompanham você e o bebê
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#766B73]">
            Uma alimentação variada ajuda a oferecer energia e os nutrientes importantes para essa
            fase.
          </p>
        </div>
        <div className="prose-content mt-6">
          <h3>Monte pratos coloridos</h3>
          <p>
            Inclua verduras, legumes, frutas, feijões, cereais integrais e proteínas bem cozidas.
            Variar as cores é uma forma simples de variar os nutrientes.
          </p>
          <h3>Nutrientes em destaque</h3>
          <ul>
            <li>
              <strong>Ferro:</strong> feijão, lentilha, carnes bem passadas e folhas verde-escuras.
            </li>
            <li>
              <strong>Cálcio:</strong> leite e derivados pasteurizados, gergelim e vegetais
              verde-escuros.
            </li>
            <li>
              <strong>Ácido fólico:</strong> folhas verdes, feijões e a suplementação indicada no
              pré-natal.
            </li>
          </ul>
          <div className="my-5 rounded-[18px] bg-[#F1F7F3] p-4 text-sm leading-6 text-[#607067]">
            <strong>Dica gentil:</strong> faça pequenas refeições ao longo do dia se estiver com
            náusea e mantenha água sempre por perto.
          </div>
          <h3>Cuidados importantes</h3>
          <p>
            Evite carnes e ovos crus, leite não pasteurizado e alimentos sem higienização adequada.
            Converse com sua equipe antes de usar chás ou suplementos.
          </p>
        </div>
      </article>
    </AppShell>
  );
}

function Mental({ go }: { go: (s: Screen) => void }) {
  const [breathing, setBreathing] = useState(false);
  return (
    <AppShell screen="mental" go={go}>
      <div className="bg-gradient-to-b from-[#EEEAF7] to-[#FFF9FA] pb-5">
        <Header
          title="Saúde emocional"
          subtitle="Um espaço seguro para você"
          onBack={() => go("info")}
        />
        <div className="mx-5 mt-2 rounded-[25px] bg-white/80 p-5 text-center shadow-sm">
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E6DFEF] text-[#8776AF] ${breathing ? "breathe" : ""}`}
          >
            <Icon name="heart" size={34} />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">Você não precisa dar conta de tudo.</h2>
          <p className="mt-2 text-sm leading-6 text-[#7C7380]">
            Respire. Seus sentimentos merecem espaço, cuidado e acolhimento.
          </p>
        </div>
      </div>
      <section className="px-5">
        <h2 className="text-base font-extrabold">Pausa de 1 minuto</h2>
        <div className="mt-3 rounded-[20px] border border-[#EDE7F1] bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0ECF7] text-[#8776AF]">
              <Icon name="activity" />
            </span>
            <div>
              <p className="text-sm font-extrabold">Respiração 4–4</p>
              <p className="text-xs text-[#8A828A]">Inspire por 4s, solte por 4s.</p>
            </div>
          </div>
          <Button
            variant="soft"
            onClick={() => setBreathing(!breathing)}
            className="mt-4 h-11 w-full"
          >
            {breathing ? "Encerrar exercício" : "Começar a respirar"}
          </Button>
          {breathing && (
            <p role="status" className="mt-3 text-center text-sm font-bold text-[#8172A6]">
              Inspire devagar… e solte com calma.
            </p>
          )}
        </div>
        <h2 className="mt-6 text-base font-extrabold">Sinais que merecem atenção</h2>
        <div className="mt-3 space-y-2">
          {[
            "Tristeza ou ansiedade persistente",
            "Dificuldade para dormir ou cuidar de si",
            "Pensamentos de se machucar ou desistir",
          ].map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl bg-[#FFF4F5] p-3 text-xs leading-5 text-[#725E64]"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D38393]" />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[20px] border border-[#E8DCE1] p-4">
          <p className="text-sm font-extrabold">Procure ajuda quando precisar</p>
          <p className="mt-1 text-xs leading-5 text-[#7C747C]">
            Converse com sua equipe de pré-natal. Em uma emergência ou risco imediato, ligue para o
            SAMU (192) ou CVV (188).
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function Baby({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [week, setWeek] = useState(24);
  const size =
    week < 24
      ? "do tamanho de uma manga"
      : week === 24
        ? "do tamanho de uma espiga de milho"
        : "do tamanho de uma couve-flor";
  return (
    <AppShell screen="baby" go={go}>
      <div className="bg-gradient-to-b from-[#EEF6F1] to-[#FFF9FA] pb-5">
        <Header title="Meu bebê" subtitle="Acompanhe cada descoberta" />
        <div className="px-5 pt-2 text-center">
          <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#6F917A]">
            Semana atual
          </span>
          <div className="mt-2 flex items-center justify-center gap-7">
            <button
              aria-label="Semana anterior"
              onClick={() => {
                setWeek(Math.max(1, week - 1));
                notify("Semana anterior selecionada.");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Icon name="chevronLeft" />
            </button>
            <div>
              <strong className="text-[44px] font-extrabold leading-none tracking-[-.06em] text-[#514B55]">
                {week}
              </strong>
              <span className="ml-1 text-sm font-bold text-[#7D757D]">semanas</span>
            </div>
            <button
              aria-label="Próxima semana"
              onClick={() => {
                setWeek(Math.min(40, week + 1));
                notify("Próxima semana selecionada.");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Icon name="chevronRight" />
            </button>
          </div>
          <div className="relative mx-auto mt-5 flex h-48 w-48 items-center justify-center rounded-full bg-[#DDEDE2] shadow-[inset_0_0_0_14px_rgba(255,255,255,.45)]">
            <div className="baby-shape flex h-28 w-24 rotate-[-12deg] items-center justify-center rounded-[52%_48%_55%_45%] bg-gradient-to-br from-[#E8B9B0] to-[#D69391] text-white shadow-lg">
              <Icon name="baby" size={54} />
            </div>
            <span className="absolute -right-5 top-7 rounded-2xl bg-white px-3 py-2 text-[10px] font-bold text-[#6C756E] shadow-sm">
              ≈ 30 cm
            </span>
            <span className="absolute -left-3 bottom-6 rounded-2xl bg-white px-3 py-2 text-[10px] font-bold text-[#6C756E] shadow-sm">
              ≈ 600 g
            </span>
          </div>
          <p className="mt-4 text-sm text-[#7F787F]">Seu bebê está aproximadamente</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#5E6F63]">{size}</h2>
        </div>
      </div>
      <section className="px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold">O que acontece agora</h2>
          <span className="rounded-full bg-[#F0F6F2] px-3 py-1 text-[10px] font-bold text-[#6F917A]">
            2º trimestre
          </span>
        </div>
        <div className="mt-3 space-y-3">
          {[
            ["spark", "Novos movimentos", "Você pode perceber chutes mais fortes e ritmados."],
            ["eye", "Sentidos em desenvolvimento", "O bebê começa a responder a sons e à sua voz."],
            ["activity", "Crescimento acelerado", "Pulmões e sistema nervoso seguem amadurecendo."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="flex gap-3 rounded-[18px] border border-[#EAF0EB] bg-white p-3.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDF6F0] text-[#75907D]">
                <Icon name={icon} size={18} />
              </span>
              <div>
                <p className="text-sm font-extrabold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#847C84]">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[10px] font-bold text-[#958D95]">
            <span>1ª semana</span>
            <span>{Math.round((week / 40) * 100)}% da gestação</span>
            <span>40ª</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#EDE8EB]">
            <div
              className="h-full rounded-full bg-[#A9C9B4] transition-all"
              style={{ width: `${(week / 40) * 100}%` }}
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Profile({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [loading, setLoading] = useState(false);
  const rows = [
    ["bell", "Gerenciar lembretes", () => go("reminders")],
    ["settings", "Configurações", () => notify("Configurações atualizadas.")],
    ["shield", "Privacidade e dados", () => notify("Seus dados estão protegidos.")],
  ] as const;
  return (
    <AppShell screen="profile" go={go}>
      <Header title="Perfil" subtitle="Seus dados e preferências" />
      <div className="px-5">
        <div className="rounded-[25px] bg-gradient-to-br from-[#F8E7EC] to-[#EFEAF7] p-5 text-center">
          <div className="relative mx-auto h-20 w-20 rounded-full bg-[#E9A8B9] p-1 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#A7687A]">
              <Icon name="user" size={34} />
            </div>
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#A9C9B4] text-white">
              <Icon name="check" size={13} />
            </span>
          </div>
          <h2 className="mt-3 text-xl font-extrabold">Mariana Alves</h2>
          <p className="mt-1 text-xs text-[#817781]">mariana.alves@email.com</p>
          <button
            onClick={() => notify("Edição de perfil aberta.")}
            className="mt-3 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold text-[#926174]"
          >
            Editar perfil
          </button>
        </div>
        <h2 className="mb-3 mt-6 text-base font-extrabold">Minha gestação</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#EEE7EB] bg-white p-4">
            <span className="text-[10px] font-bold uppercase text-[#9A919A]">
              Idade gestacional
            </span>
            <p className="mt-1 text-lg font-extrabold">24 semanas</p>
          </div>
          <div className="rounded-[18px] border border-[#EEE7EB] bg-white p-4">
            <span className="text-[10px] font-bold uppercase text-[#9A919A]">Parto previsto</span>
            <p className="mt-1 text-lg font-extrabold">06 out 2025</p>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#EEE7EB] bg-white">
          {rows.map(([icon, title, action], index) => (
            <button
              key={title}
              onClick={action}
              className={`flex w-full items-center gap-3 p-4 text-left ${index !== rows.length - 1 ? "border-b border-[#F0EAED]" : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF0F3] text-[#956477]">
                <Icon name={icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-bold">{title}</span>
              <Icon name="chevronRight" size={17} className="text-[#ABA2A9]" />
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              notify("Dados sincronizados com sucesso.");
            }, 800);
          }}
          className="mt-3 w-full text-xs"
        >
          {loading ? "Sincronizando..." : "Sincronizar dados agora"}
        </Button>
        <button
          onClick={() => go("welcome")}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-[#B25D6B]"
        >
          <Icon name="logout" size={17} />
          Encerrar sessão
        </button>
        <p className="mt-3 text-center text-[10px] text-[#A59DA4]">
          Gestar+ versão 1.0 · Seus dados são privados
        </p>
      </div>
    </AppShell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<Screen[]>([]);

  const go = (next: Screen) => {
    setHistory([...history, screen]);
    setScreen(next);
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const content = useMemo(() => {
    if (screen === "welcome") return <Welcome go={go} />;
    if (screen === "login") return <Login go={go} />;
    if (screen === "register") return <Register go={go} />;
    if (screen === "home") return <Home go={go} />;
    if (screen === "calendar") return <CalendarScreen go={go} notify={notify} />;
    if (screen === "reminders") return <Reminders go={go} notify={notify} />;
    if (screen === "info") return <Info go={go} />;
    if (screen === "article") return <Article go={go} />;
    if (screen === "mental") return <Mental go={go} />;
    if (screen === "baby") return <Baby go={go} notify={notify} />;
    return <Profile go={go} notify={notify} />;
  }, [screen]);

  return (
    <div className="device-stage">
      {content}
      {toast && (
        <div role="status" className="toast">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A9C9B4] text-white">
            <Icon name="check" size={14} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
