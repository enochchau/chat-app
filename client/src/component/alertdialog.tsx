import * as React from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useMultiStyleConfig,
  useStyleConfig
} from '@chakra-ui/react';

interface MyAlertDialogProps {
  cancelButtonText: string,
  okayButtonText: string,
  onOkayClick: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode,
  header: string,
  isOpen: boolean,
  onClose: () => void,
  disableOkayButton?: boolean,
}
export const MyAlertDialog: React.FC<MyAlertDialogProps> = ({
  cancelButtonText,
  okayButtonText,
  onOkayClick,
  children,
  header,
  isOpen,
  onClose,
  disableOkayButton,
}) => {
  const cancelRef = React.useRef<any>();
  const alertStyles = useMultiStyleConfig("AlertDialog", {variant: "removeMessage"});
  const okayButtonStyle = useStyleConfig('Button', {variant: 'okay'});
  const cancelButtonStyle = useStyleConfig('Button', {variant: 'cancel'});
  return(
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose} 
      isCentered
      size="xl"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader sx={alertStyles.header}>
            {header}
          </AlertDialogHeader>
          <AlertDialogCloseButton sx={alertStyles.closeButton}/>
          <AlertDialogBody>
            {children}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button 
              ref={cancelRef}
              onClick={(_e): void => {onClose()}}
              sx={cancelButtonStyle}
            >
              {cancelButtonText}
            </Button>
            <Button 
              onClick={(e): void => {
                onClose();
                onOkayClick(e);
              }}
              sx={okayButtonStyle}
              disabled={disableOkayButton}
            >
              {okayButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}