<!DOCTYPE html>
<html lang="en">
    <?php $this->inc('elements/head.php'); ?> 
    <body ng-app="hbcAPP">
	    <script>
	        $(document).ready(function(){
	            $("body .section:odd").addClass("even");
	            $("body .section:even").addClass("odd");
	        });
	        <?php if($c->isEditMode()){ ?>
	        	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
				var observer = new MutationObserver(function(mutations, observer) {
			        $("body .section:odd").addClass("even");
		            $("body .section:even").addClass("odd");
				});
				observer.observe(document, {
				  subtree: true,
				  attributes: true
				});
	        <?php } ?>
	    </script>
	    <div class="<?php echo $c->getPageWrapperClass()?>">
	        <?php $this->inc('elements/navigation.php'); ?> 
	        <?php
	            $a = new Area('Slide');
	            $a->display($c);
	        ?>
	        <div class="container-fluid">
	        	<div class="row">
		        	<?php
		            	$a = new Area('Main');
		            	$a->setAreaGridMaximumColumns(12);
		            	$a->display($c);
		        	?>
		        </div>
		    </div>
	        <?php
	          $a = new GlobalArea('Connection');
	          $a->display();
	        ?>
	        <?php $this->inc('elements/footer.php'); ?> 
	    </div>
	    <?php Loader::element('footer_required')?>
    </body>
</html>
