import React from "react";

interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

export const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm lg:uppercase">
          {columns.map(({ header, className }) => (
            <th key={header} className={className}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data?.length < 1 && (
          <tr className="text-gray-400 text-base py-10">
            <td>Aucune donnée trouvée</td>
          </tr>
        )}

        {data?.length > 0 &&
          data.map((item, id) => (
            // IMPORTANT : ici on doit passer une clé unique pour chaque ligne,
            // donc on enveloppe renderRow dans un fragment avec key unique basée sur id ou item.id
            <React.Fragment key={item.id ?? id}>
              {renderRow({ ...item, index: id })}
            </React.Fragment>
          ))}
      </tbody>
    </table>
  );
};
