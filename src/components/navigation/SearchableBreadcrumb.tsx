import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

const SearchableBreadcrumb: React.FC = () => {
  const { history } = useNavigation();
  const navigate = useNavigate();

  if (history.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
        {history.map((item, index) => {
          const isLast = index === history.length - 1;

          return (
            <React.Fragment key={`${item.path}-${item.timestamp}`}>
              {index > 0 ? (
                <span className="px-1 text-muted-foreground select-none">/</span>
              ) : null}
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={cn(
                  "truncate rounded px-1 py-0.5 transition-colors",
                  isLast
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={item.label}
              >
                {item.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default SearchableBreadcrumb;
