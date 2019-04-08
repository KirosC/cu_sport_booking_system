<?php
/**
 *
 */
//Missing Database entry
class Venue_model extends CI_Model
{
    //Attribute
    public $venue_id;
    public $name;
    public $price;
    public $sports_id;
    public $college_id;

    //Function
    public function venue_search()
    {
      $this->db->select(
        'venue_id,
        college_id,
        venue.name AS venue,
        sports.name AS sport');
      $this->db->from('venue');
      $this->db->join('sports', 'sports.sports_id = venue.sports_id');
      $query = $this->db->get();


      return $query->result();
    }

    public function venue_search_by_id($college_id = "", $sport_id = "")
    {
      $this->db->select('venue_id, name AS venue');
      $this->db->from('venue');
      if ($college_id != "") {
        $this->db->where('college_id', $college_id);
      }
      if ($sport_id != "") {
        $this->db->where('sports_id', $sport_id);
      }
      $query = $this->db->get();
      return $query->result();
    }
}
?>
