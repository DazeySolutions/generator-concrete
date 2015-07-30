<?php
namespace Application\Theme\Hbc;
use Concrete\Core\Page\Theme\Theme;
class PageTheme extends Theme {
    protected $pThemeGridFrameworkHandle = 'bootstrap3s';
    
    public function registerAssets(){
    	$this->providesAsset('javascript', 'bootstrap/*');
    	$this->providesAsset('css', 'bootstrap/*');
    	$this->providesAsset('css', 'blocks/form');
    	$this->providesAsset('css', 'core/frontend/*');
    	$this->requireAsset('javascript', 'jquery');
    }
        
}

