import { createFileRoute } from "@tanstack/react-router";
import { useTotes } from "../hooks/useTotes";
import { format } from "date-fns";
import { Link } from "../components/Link";

export const Route = createFileRoute("/totes")({
  component: RouteComponent,
  loader: async () => {},
});

function RouteComponent() {
  const { totes } = useTotes();
  return (
    <ul className="list rounded-box bg-base-200 shadow-lg">
      <li className="p-4 pb-2 text-xs tracking-wide opacity-60">Your totes</li>

      {totes?.map((t) => (
        <li className="list-row">
          {/* <div>
            <img
              className="size-10 rounded-box"
              src="https://img.daisyui.com/images/profile/demo/1@94.webp"
            />
          </div> */}
          <div>
            <div className="text-xl">
              <Link to="/totes/$toteId">{t.tote_name}</Link>
            </div>
            <div className="pt-2 text-xs font-semibold uppercase opacity-40">
              Created {format(t.created_on, "PP")}
            </div>
          </div>
          <p className="list-col-wrap text-xs">{t.tote_description}</p>
          {/* <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </g>
            </svg>
          </button> */}
        </li>
      ))}
    </ul>
  );
}
