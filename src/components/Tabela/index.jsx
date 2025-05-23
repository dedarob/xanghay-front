import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import styles from "./Tabela.module.css";
import { FaTrash, FaPlus, FaPen } from "react-icons/fa";

const Tabela = ({ rows, columns, onRowClick }) => {
  return (
    <div>
      <div className={styles.around_botoes_acao}>
        <button>
          <FaPlus className={styles.icon} />
        </button>
        <button>
          <FaPen className={styles.icon} />
        </button>
        <button className={styles.icon_trash}>
          <FaTrash />
        </button>
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
