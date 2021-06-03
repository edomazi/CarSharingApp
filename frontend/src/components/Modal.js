import React from "react";
import PropTypes from 'prop-types';

const Modal = ({title, description, closeButtonText,
                 actionButtonText,
                 hideActionButton = false,
                 classActionButton = 'btn btn-primary mr-1',
                 onClickAction, onClickClose}) => {
  return(
    <div className="modal-backdrop">
      <div className="card"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription">
        <div className="card-header p-3"
             id="modalTitle">
          <h4 className="mb-0">{title}</h4>
          <button onClick={(e) => onClickClose(e)}
              type="button"
              className="btn ml-auto"
              aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="card-body"
             id="modalDescription"
             dangerouslySetInnerHTML={{ __html: description}}>
        </div>
        <div className="card-footer text-right">
            <button onClick={(e) => onClickClose(e)}
                    id="closeButton"
                    className="btn btn-secondary mr-1"
                    aria-label="Close modal">
              {closeButtonText}
          </button>
          {!hideActionButton ?
            <button onClick={(e) => onClickAction(e, title)}
                  id="actionButton"
                  className={classActionButton}
                  aria-label="Close modal">
            {actionButtonText}
          </button> : ''}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  closeButtonText: PropTypes.string.isRequired,
  actionButtonText: PropTypes.string,
  classActionButton: PropTypes.string,
  hideActionButton: PropTypes.bool,
  onClickAction: PropTypes.func,
  onClickClose: PropTypes.func,
};

export default Modal
