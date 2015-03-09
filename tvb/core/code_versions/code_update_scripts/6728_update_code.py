# -*- coding: utf-8 -*-
#
#
# TheVirtualBrain-Framework Package. This package holds all Data Management, and
# Web-UI helpful to run brain-simulations. To use it, you also need do download
# TheVirtualBrain-Scientific Package (for simulators). See content of the
# documentation-folder for more details. See also http://www.thevirtualbrain.org
#
# (c) 2012-2013, Baycrest Centre for Geriatric Care ("Baycrest")
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License version 2 as published by the Free
# Software Foundation. This program is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
# License for more details. You should have received a copy of the GNU General
# Public License along with this program; if not, you can download it here
# http://www.gnu.org/licenses/old-licenses/gpl-2.0
#
#
#   CITATION:
# When using The Virtual Brain for scientific publications, please cite it as follows:
#
#   Paula Sanz Leon, Stuart A. Knock, M. Marmaduke Woodman, Lia Domide,
#   Jochen Mersmann, Anthony R. McIntosh, Viktor Jirsa (2013)
#       The Virtual Brain: a simulator of primate brain network dynamics.
#   Frontiers in Neuroinformatics (7:10. doi: 10.3389/fninf.2013.00010)
#
#

"""
Populate Surface fields after 1.2.2, in version 1.2.3.

.. moduleauthor:: Lia Domide <lia.domide@codemart.ro>
"""

from tvb.basic.logger.builder import get_logger
from tvb.core.entities.storage import dao
from tvb.core.entities import model
from tvb.datatypes.surfaces import Surface


LOGGER = get_logger(__name__)

def update():
    """
    Try to import Default_Project, so that new users created with the latest code can share this project.
    """

    try:
        all_surfaces = dao.get_generic_entity(model.DataType, "tvb.datatypes.surfaces", "module")
        for srf in all_surfaces:
            surface = dao.get_datatype_by_gid(srf.gid)
            if isinstance(surface, Surface):
                surface._find_edge_lengths()
                dao.store_entity(surface)
    except Exception:
        LOGGER.exception("Could update Surface entities!")
