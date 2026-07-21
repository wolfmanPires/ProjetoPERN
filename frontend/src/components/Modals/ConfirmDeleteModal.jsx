import { TriangleAlert } from 'lucide-react'
import React from 'react'

function ConfirmDeleteModal({ titulo, onConfirm }) {
  return (
    <dialog id='confirmDeleteModal' className='modal'>
      <div className='modal-box'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <TriangleAlert className='text-warning' />
          Confirmar eliminação
        </h2>

        <p className="py-4">Tens a certeza que pretendes eliminar <b>{titulo}</b>?<br />Esta ação não pode ser desfeita.</p>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => document.getElementById("confirmDeleteModal").close()}>
            Cancelar
          </button>

          <button className="btn btn-error" onClick={() => {
              onConfirm();
              document.getElementById("confirmDeleteModal").close();
            }}>
            Eliminar
          </button>
        </div>
      </div>

      {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
      <form method="dialog" className="modal-backdrop">
        <button>Fechar</button>
      </form>
    </dialog>
  )
}

export default ConfirmDeleteModal
