<!DOCTYPE html>
<html lang="en">
    <?php $this->inc('elements/head.php'); ?> 
    <body>
	    <div class="<?php echo $c->getPageWrapperClass()?>">
	        <?php $this->inc('elements/navigation.php'); ?> 
	        <?php $this->inc('elements/footer.php'); ?> 
	    </div>
	    <?php Loader::element('footer_required')?>
    </body>
</html>
