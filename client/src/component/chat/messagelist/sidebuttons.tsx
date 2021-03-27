import * as React from 'react';
import {
  Flex,
  useStyleConfig,
  useStyles,
  Tooltip,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Button,
  Heading,
  Text,
  useMultiStyleConfig,

} from '@chakra-ui/react';
import { /*EllipsisVIcon, SmileIconRegular, ReplyIcon,*/ XIcon } from '../../icon';

interface SideButtonsProps {
  // onSmileClick?: React.MouseEventHandler<HTMLButtonElement>,
  // onReplyClick?: React.MouseEventHandler<HTMLButtonElement>,
  // onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>,
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>,
}
export const SideButtons: React.FC<SideButtonsProps> = ({
  // onSmileClick, 
  // onReplyClick, 
  // onOptionsClick, 
  onRemoveClick
}) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const cancelRef = React.useRef<any>();

  const iconStyles = useStyleConfig("Icon", { variant: "sideMsgButton" })
  const tooltipStyles = useStyleConfig("Tooltip", {variant: "sideMsgButton"})
  const parentStyles = useStyles();

  const alertStyles = useMultiStyleConfig("AlertDialog", {variant: "removeMessage"});
  const okayButtonStyle = useStyleConfig('Button', {variant: 'okay'});
  const cancelButtonStyle = useStyleConfig('Button', {variant: 'cancel'});

  return (
    <Flex sx={parentStyles.sideButtons}>
      
      <Tooltip
        label="Remove"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<XIcon/>}  
            onClick={(): void => setOpenDelete(true)}
          />
        </span>
      </Tooltip>
      <AlertDialog
        isOpen={openDelete}
        leastDestructiveRef={cancelRef}
        onClose={(): void => setOpenDelete(false)}
        isCentered
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader sx={alertStyles.header}>
              Would you like to remove this message?
            </AlertDialogHeader>
            <AlertDialogCloseButton sx={alertStyles.closeButton}/>
            <AlertDialogBody>
              <Heading fontSize="md">Unsend for everyone</Heading> 
              <Text color="gray.500" fontSize="md">
                You'll permanently remove this message for all chat members. They can see that you've unsent a message.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button 
                ref={cancelRef}
                onClick={(): void => setOpenDelete(false)}
                sx={cancelButtonStyle}
              >
               Cancel
              </Button>
              <Button 
                onClick={(e): void => {setOpenDelete(false); onRemoveClick(e);}}
                sx={okayButtonStyle}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* <Tooltip
        label="React"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<SmileIconRegular onClick={onSmileClick}/>}  
          />
        </span>
      </Tooltip>
      <Tooltip
        label="Reply"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<ReplyIcon onClick={onReplyClick}/>}
          />
        </span>
      </Tooltip>
      <Tooltip
        label="More"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<EllipsisVIcon onClick={onOptionsClick}/>}
          />
        </span>
      </Tooltip> */}
    </Flex>
  );
}