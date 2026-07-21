import { BackButton } from "@/components/BackButton";

export function PageHeader({
  title,
  description,
  action,
  showBack = true,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <div className="page-title">
      <div>
        {showBack ? <BackButton /> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
