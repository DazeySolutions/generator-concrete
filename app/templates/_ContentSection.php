<?php

class ContentSection extends DataObject {
	private static $db = array(
		'SortOrder' => 'Int',
        'Title' => 'Varchar',
		'Content' => 'HTMLText'
	);
    private  static $extensions = array(
        "Versioned('Stage', 'Live')"
    );
	private static $has_one = array(
		'Page' => 'Page'
	);
	public function getCMSFields(){
		$fields = parent::getCMSFields();
		$fields->removeFieldFromTab("Root.Main","PageID");
		$fields->removeFieldFromTab("Root.Main","SortOrder");
        return $fields;
	}
	private static $summary_fields = array(
		'Title'=>'Title',
        'Content'=>'Content',
	);
}
