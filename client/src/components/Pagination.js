import React, { memo } from "react";
import { useSearchParams } from "react-router-dom";
import PagiItem from "./PagiItem";
import usePagination from "./usePagination";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, params.get("page") || 1);
  console.log("thu", pagination);
  const range = () => {
    const currentPage = +params.get("page");
    const pageSize = +2 || 10;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);

    return `${start} - ${end} `;
  };
  return (
    <div className="flex w-full justify-between items-center">
      {!+params.get("page") ? (
        <span>{`Trang 1 - ${
          Math.min(2, totalCount) || 10
        } of ${totalCount}`}</span>
      ) : (
        ""
      )}
      {+params.get("page") ? (
        <span>{`Trang ${range()} of ${totalCount}`}</span>
      ) : (
        ""
      )}
      <div className="flex items-center">
        {pagination?.map((el) => (
          <PagiItem key={el}>{el}</PagiItem>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
