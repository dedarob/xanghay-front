import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import styles from "./Tabela.module.css";
import { FaTrash, FaPlus, FaPen, FaDollarSign } from "react-icons/fa";

const Tabela = ({
  rows,
  columns,
  onRowClick,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onDollarClick,
  showActions = true,
  className,
}) => {
  return (
    <div className={className}>
      <div className={styles.around_botoes_acao}>
        {onAddClick && (
          <button onClick={onAddClick}>
            <FaPlus className={styles.icon} />
          </button>
        )}
        {onEditClick && (
          <button onClick={onEditClick}>
            <FaPen className={styles.icon} />
          </button>
        )}
        {onDollarClick && (
          <button onClick={onDollarClick}>
            <FaDollarSign className={styles.icon} />
          </button>
        )}
        {onDeleteClick && (
          <button onClick={onDeleteClick} className={styles.icon_trash}>
            <FaTrash />
          </button>
        )}
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        autoHeight
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? styles.rowWhite
            : styles.rowGray
        }
        onRowClick={onRowClick}
      />
    </div>
  );
};

Tabela.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default Tabela;
